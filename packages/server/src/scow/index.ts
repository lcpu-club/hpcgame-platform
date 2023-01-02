import { SCOW } from 'scow-api'
import { ServiceError, status } from '@grpc/grpc-js'
import {
  SCOW_ADMIN_NAME,
  SCOW_ADMIN_PASS,
  SCOW_GRPC_ADDR,
  SCOW_TENANT_NAME
} from '../config/index.js'
import { UserGroup, UserGroups } from '../db/user.js'
import {
  defaultUserChargeLimit,
  kUserChargeLimit,
  sysGet
} from '../db/syskv.js'

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
        accountName: `${SCOW_TENANT_NAME}_runner_${group}`,
        ownerId: SCOW_ADMIN_NAME,
        comment: `Account for runner for HPCGP group ${group}`
      })
    )
    await _(
      scow.account.invoke('createAccount', {
        tenantName: SCOW_TENANT_NAME,
        accountName: `${SCOW_TENANT_NAME}_user_${group}`,
        ownerId: SCOW_ADMIN_NAME,
        comment: `Account for user in HPCGP group ${group}`
      })
    )
  }
}

export async function createPlatformUser(
  identityId: string,
  password: string,
  group: UserGroup,
  name?: string,
  email?: string
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
  const accountName = `${SCOW_TENANT_NAME}_user_${group}`
  await _(
    scow.user.invoke('addUserToAccount', {
      tenantName: SCOW_TENANT_NAME,
      userId: identityId,
      accountName
    })
  )
  const limit = await sysGet(kUserChargeLimit, defaultUserChargeLimit)
  if (limit[group]) {
    await _(
      scow.jobChargeLimit.invoke('setJobChargeLimit', {
        tenantName: SCOW_TENANT_NAME,
        accountName,
        userId: identityId,
        limit: {
          positive: true,
          yuan: limit[group],
          decimalPlace: 0
        }
      })
    )
  }
}
