import { SCOW } from 'scow-api'
import { type ServiceError, status } from '@grpc/grpc-js'
import {
  SCOW_ADMIN_NAME,
  SCOW_ADMIN_PASS,
  SCOW_GRPC_ADDR,
  SCOW_TENANT_NAME
} from '../config/index.js'
import { type UserGroup, UserGroups } from '../db/user.js'

export const scow = new SCOW(SCOW_GRPC_ADDR)

async function ignoreMeaninglessError<T>(promise: Promise<T>) {
  try {
    return await promise
  } catch (e) {
    const err = e as ServiceError
    if (
      [status.ALREADY_EXISTS, status.FAILED_PRECONDITION].some(
        (x) => x === err.code
      )
    ) {
      return
    }
    throw e
  }
}

export function getUserAccount(group: UserGroup) {
  return `${SCOW_TENANT_NAME}_user_${group}`
}

export function getRunnerAccount(group: UserGroup) {
  return `${SCOW_TENANT_NAME}_runner_${group}`
}

export async function initSCOW() {
  const _ = ignoreMeaninglessError
  await _(
    scow.tenant.invoke('createTenant', {
      name: SCOW_TENANT_NAME
    })
  )
  await _(
    scow.user.invoke('createUser', {
      tenantName: SCOW_TENANT_NAME,
      identityId: SCOW_ADMIN_NAME,
      name: SCOW_ADMIN_NAME,
      email: `${SCOW_ADMIN_NAME}@hpc.pku.edu.cn`,
      password: SCOW_ADMIN_PASS
    })
  )
  await _(
    scow.user.invoke('setPlatformRole', {
      userId: SCOW_ADMIN_NAME,
      roleType: 0
    })
  )
  await _(
    scow.user.invoke('setTenantRole', {
      userId: SCOW_ADMIN_NAME,
      roleType: 0
    })
  )
  for (const group of UserGroups) {
    await _(
      scow.account.invoke('createAccount', {
        tenantName: SCOW_TENANT_NAME,
        accountName: getRunnerAccount(group),
        ownerId: SCOW_ADMIN_NAME,
        comment: `Account for runner for HPCGP group ${group}`
      })
    )
    await _(
      scow.account.invoke('createAccount', {
        tenantName: SCOW_TENANT_NAME,
        accountName: getUserAccount(group),
        ownerId: SCOW_ADMIN_NAME,
        comment: `Account for user in HPCGP group ${group}`
      })
    )
  }
}

export async function createSCOWUser(
  identityId: string,
  password: string,
  accountName: string,
  name?: string,
  email?: string,
  limit?: number
) {
  const _ = ignoreMeaninglessError
  await _(
    scow.user.invoke('createUser', {
      tenantName: SCOW_TENANT_NAME,
      identityId,
      name: name ?? identityId,
      email: email ?? `${identityId}@fake.hpcgame.pku.edu.cn`,
      password
    })
  )
  await _(
    scow.user.invoke('addUserToAccount', {
      tenantName: SCOW_TENANT_NAME,
      userId: identityId,
      accountName
    })
  )
  if (limit) {
    await _(
      scow.jobChargeLimit.invoke('setJobChargeLimit', {
        tenantName: SCOW_TENANT_NAME,
        accountName,
        userId: identityId,
        limit: {
          positive: true,
          yuan: limit,
          decimalPlace: 0
        }
      })
    )
  }
}
