export interface IMatchClause {
  $eq?: unknown
  $startsWith?: string
  $endsWith?: string
  $includes?: string
}

export interface IMatchExpr {
  [key: string]: IMatchClause
}

export type IRuleMatch = {
  $and?: IMatchExpr[]
  $or?: IMatchExpr[]
} & IMatchExpr

export interface IRule {
  $match: IRuleMatch
  $returns: unknown
}

// Get a nested property from an object
// Using dot to separate the path
export function deepGet<T>(obj: unknown, path: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((o, i) => o?.[i], obj as any) as T
}

export function matchExpr(
  expr: IMatchExpr,
  variables: Record<string, unknown>
) {
  for (const [key, cond] of Object.entries(expr)) {
    const value = deepGet(variables, key)
    if ('$eq' in cond) {
      if (value !== cond.$eq) return false
    }
    if ('$startsWith' in cond) {
      if (typeof value !== 'string') return false
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!value.startsWith(cond.$startsWith!)) return false
    }
    if ('$endsWith' in cond) {
      if (typeof value !== 'string') return false
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!value.endsWith(cond.$endsWith!)) return false
    }
    if ('$includes' in cond) {
      if (typeof value !== 'string' && !(value instanceof Array)) return false
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!value.includes(cond.$includes!)) return false
    }
  }
  return true
}

export function matchRule(
  match: IRuleMatch,
  variables: Record<string, unknown>
) {
  const { $and, $or, ...rest } = match
  if ($and && !$and.every((clause) => matchExpr(clause, variables))) {
    return false
  }
  if (!matchExpr(rest, variables)) {
    return false
  }
  return !$or || $or.some((clause) => matchExpr(clause, variables))
}

export function execuateRules<T>(
  rules: IRule[],
  variables: Record<string, unknown>,
  defaultReturns: T
): T {
  for (const rule of rules) {
    if (matchRule(rule.$match, variables)) return rule.$returns as T
  }
  return defaultReturns
}
