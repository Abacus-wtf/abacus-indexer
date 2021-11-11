import {
  PricingSession,
  User
} from '../generated/schema'
import {
  PricingSessionCreated,
  PricingSession as PricingSessionContract,
  sessionEnded,
  appraisalIncreased,
  bountyIncreased,
  finalAppraisalDetermined,
  voteWeighed,
  newAppraisalAdded,
  userHarvested
} from '../generated/PricingSession/PricingSession'
import { BigInt } from '@graphprotocol/graph-ts'

function loadPricingSession(nftAddress: string, tokenId: string, nonce: string): PricingSession | null {
  return PricingSession.load(nftAddress + '/' + tokenId + '/' + nonce)
}

export function handlePricingSessionCreated(event: PricingSessionCreated): void {
  const sessionAddress = PricingSessionContract.bind(event.address)

  let session = new PricingSession(event.params.nftAddress_.toHexString() + '/' + event.params.tokenid_.toString() + '/' + event.params.nonce.toString())
  session.nftAddress = event.params.nftAddress_.toHexString()
  session.tokenId = event.params.tokenid_.toI32()
  session.creator = event.params.creator_.toHexString()
  session.createdAt = event.block.timestamp
  session.finalAppraisalValue = new BigInt(0)
  session.participants = []
  session.numParticipants = 0
  session.totalStaked = new BigInt(0)
  session.nonce = event.params.nonce
  session.bounty = event.params.bounty_
  
  const core = sessionAddress.NftSessionCore(event.params.nonce, event.params.nftAddress_, event.params.tokenid_)
  const check = sessionAddress.NftSessionCheck(event.params.nonce, event.params.nftAddress_, event.params.tokenid_)
  session.endTime = core.value0
  session.sessionStatus = check.value0.toI32()
  session.votingTime = core.value10

  let user = User.load(event.params.creator_.toHexString())
  if (!user) {
    user = new User(event.params.creator_.toHexString())
    user.save()
  }

  session.save()
}

export function handleappraisalIncreased(event: appraisalIncreased): void {
  let session = loadPricingSession(event.params.nftAddress_.toHexString(), event.params.tokenid_.toString(), event.params.nonce.toString())
  if (session) {
    session.totalStaked = session.totalStaked.plus(event.params.amount_)
    session.save()
  }
}

export function handlebountyIncreased(event: bountyIncreased): void {
  let session = loadPricingSession(event.params.nftAddress_.toHexString(), event.params.tokenid_.toString(), event.params.nonce.toString())
  if (session) {
    session.bounty = session.bounty.plus(event.params.amount_)
    session.save()
  }
}

export function handlefinalAppraisalDetermined(
  event: finalAppraisalDetermined
): void {
  let session = loadPricingSession(event.params.nftAddress_.toHexString(), event.params.tokenid_.toString(), event.params.nonce.toString())
  if (session) {
    session.finalAppraisalValue = event.params.finalAppraisal
    session.sessionStatus = 3
    session.save()
  }
}

export function handleuserHarvested(
  event: userHarvested
): void {
  let session = loadPricingSession(event.params.nftAddress_.toHexString(), event.params.tokenid_.toString(), event.params.nonce.toString())
  if (session) {
    session.totalStaked = session.totalStaked.minus(event.params.harvested)
    
    const sessionAddress = PricingSessionContract.bind(event.address)
    const check = sessionAddress.NftSessionCheck(event.params.nonce, event.params.nftAddress_, event.params.tokenid_)
    const core = sessionAddress.NftSessionCore(event.params.nonce, event.params.nftAddress_, event.params.tokenid_)
    
    if (check.value1 === core.value9) {
      session.sessionStatus = 4
    }

    session.save()
  }
}

export function handlesessionEnded(event: sessionEnded): void {
  let session = loadPricingSession(event.params.nftAddress.toHexString(), event.params.tokenid.toString(), event.params.nonce.toString())
  if (session) {
    session.sessionStatus = 5
    session.save()
  }
}

export function handlenewAppraisalAdded(event: newAppraisalAdded): void {
  let session = loadPricingSession(event.params.nftAddress_.toHexString(), event.params.tokenid_.toString(), event.params.nonce.toString())
  if (session) {
    let participants = session.participants
    participants.push(event.params.voter_.toHexString())
    session.participants = participants
    session.numParticipants += 1
    session.save()
  }
}

export function handlevoteWeighed(event: voteWeighed): void {
  let session = loadPricingSession(event.params.nftAddress_.toHexString(), event.params.tokenid_.toString(), event.params.nonce.toString())
  if (session) {
    if (session.sessionStatus === 0) {
      session.sessionStatus = 1
    }

    const sessionAddress = PricingSessionContract.bind(event.address)
    const check = sessionAddress.NftSessionCheck(event.params.nonce, event.params.nftAddress_, event.params.tokenid_)
    const core = sessionAddress.NftSessionCore(event.params.nonce, event.params.nftAddress_, event.params.tokenid_)
    
    if (check.value1 == core.value9 || core.value0.plus(core.value10) < event.block.timestamp) {
      session.sessionStatus = 2
    }
    session.save()
  }
}
