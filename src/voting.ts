import { changedOwner as changedOwnerEvent } from "../generated/Voting/Voting"
import { changedOwner } from "../generated/schema"

export function handlechangedOwner(event: changedOwnerEvent): void {
  let entity = new changedOwner(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newOwner = event.params.newOwner
  entity.oldOwner = event.params.oldOwner
  entity.message = event.params.message

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
