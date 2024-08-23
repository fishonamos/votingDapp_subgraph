import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { changedOwner } from "../generated/Voting/Voting"

export function createchangedOwnerEvent(
  newOwner: Address,
  oldOwner: Address,
  message: string
): changedOwner {
  let changedOwnerEvent = changetype<changedOwner>(newMockEvent())

  changedOwnerEvent.parameters = new Array()

  changedOwnerEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )
  changedOwnerEvent.parameters.push(
    new ethereum.EventParam("oldOwner", ethereum.Value.fromAddress(oldOwner))
  )
  changedOwnerEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromString(message))
  )

  return changedOwnerEvent
}
