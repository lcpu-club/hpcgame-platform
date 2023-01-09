import { PriorityQueue } from 'js-sdsl'
import { Users } from '../../db/user.js'
import {
  IRanklistPlayer,
  IRanklistOptions,
  IRanklistTopstar,
  IRanklistTopstarMutation,
  Ranklists
} from '../../db/ranklist.js'
import { consume, IRankRequestMsg, rankRequestTopic } from '../../mq/index.js'
import { Debouncer } from '../../utils/debounce.js'
import { logger } from '../../logger/index.js'

async function generatePlayers({ filter, playerCount }: IRanklistOptions) {
  const users = Users.find(filter, { projection: { _id: 1, problemStatus: 1 } })
  const queue = new PriorityQueue<IRanklistPlayer>(
    [],
    (x, y) => x.score - y.score,
    false
  )
  for await (const user of users) {
    const scores = Object.fromEntries(
      Object.entries(user.problemStatus).map(([key, value]) => [
        key,
        value.score
      ])
    )
    const score = Object.values(user.problemStatus).reduce(
      (acc, cur) => acc + cur.score,
      0
    )
    const item: IRanklistPlayer = {
      userId: user._id,
      score,
      scores
    }
    queue.push(item)
    if (queue.size() > playerCount) queue.pop()
  }
  const players: IRanklistPlayer[] = []
  while (queue.size()) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    players.push(queue.pop()!)
  }
  return players.reverse()
}

function mergeMutations(
  oldMutations: IRanklistTopstarMutation[],
  score: number,
  now: number
) {
  if (oldMutations[oldMutations.length - 1]?.score !== score) {
    return [...oldMutations, { score, timestamp: now }]
  }
  return oldMutations
}

async function generateTopstars(
  { topstarCount }: IRanklistOptions,
  players: IRanklistPlayer[],
  prev: IRanklistTopstar[]
) {
  const topPlayers = players.slice(0, topstarCount)
  const prevInfo = Object.fromEntries(prev.map((item) => [item.userId, item]))
  const now = Date.now()
  const topStars: IRanklistTopstar[] = topPlayers.map(({ userId, score }) => ({
    userId,
    mutations: mergeMutations(prevInfo[userId]?.mutations ?? [], score, now)
  }))
  return topStars
}

// Delay must be smaller than NSQ's timeout
const debouncer = new Debouncer(30000)
consume<IRankRequestMsg>(
  rankRequestTopic,
  'default',
  async (data, msg) => {
    msg.finish()
    logger.info(data)
    if (!(await debouncer.wait())) return
    logger.info('Ranking all ranklists')
    const start = Date.now()
    const ranklists = await Ranklists.find().toArray()
    for (const ranklist of ranklists) {
      const { options } = ranklist
      const players = await generatePlayers(options)
      const topstars = await generateTopstars(
        options,
        players,
        ranklist.topstars
      )
      await Ranklists.updateOne(
        { _id: ranklist._id },
        { $set: { players, topstars, updatedAt: Date.now() } }
      )
    }
    const elapsed = (Date.now() - start) / 1000
    logger.info(`Ranking done in ${elapsed.toFixed(2)} s`)
  },
  { manual: true }
)
