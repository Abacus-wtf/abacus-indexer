import {
  PricingSession,
  User,
  Vote
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
import { BigInt, log } from '@graphprotocol/graph-ts'

function loadPricingSession(nftAddress: string, tokenId: string, nonce: string): PricingSession | null {
  return PricingSession.load(nftAddress + '/' + tokenId + '/' + nonce)
}

/*function hashValues(nonce: BigInt, address: Address, tokenId: BigInt): Bytes {
  const tupleArray: Array<ethereum.Value> = [
    ethereum.Value.fromUnsignedBigInt(nonce), 
    ethereum.Value.fromAddress(address),
    ethereum.Value.fromUnsignedBigInt(tokenId),
  ]
  const encodedParams = ethereum.encode(ethereum.Value.fromFixedSizedArray(tupleArray))!
  const encodedSpliced = encodedParams.toHexString().slice(0, 66) + encodedParams.toHexString().slice(90, encodedParams.toHexString().length)
  return Bytes.fromHexString(crypto.keccak256(Bytes.fromHexString(encodedSpliced)).toHexString()) as Bytes
}*/

export function handlePricingSessionCreated(event: PricingSessionCreated): void {
  const sessionAddress = PricingSessionContract.bind(event.address)

  let session = new PricingSession(event.params.nftAddress_.toHexString() + '/' + event.params.tokenid_.toString() + '/' + event.params.nonce.toString())
  session.nftAddress = event.params.nftAddress_.toHexString()
  session.tokenId = event.params.tokenid_
  session.creator = event.params.creator_.toHexString()
  session.createdAt = event.block.timestamp
  session.finalAppraisalValue = new BigInt(0)
  session.participants = []
  session.numParticipants = 0
  session.totalStaked = new BigInt(0)
  session.timeFinalAppraisalSet = new BigInt(0)
  session.nonce = event.params.nonce
  session.bounty = event.params.bounty_

  const core = sessionAddress.NftSessionCore(
    event.params.nonce,
    event.params.nftAddress_,
    event.params.tokenid_
  )

  session.maxAppraisal = core.value3
  session.endTime = core.value0
  session.sessionStatus = 0
  session.votingTime = core.value10

  let creator = User.load(event.params.creator_.toHexString())
  if (!creator) {
    creator = new User(event.params.creator_.toHexString())
    creator.save()
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
    //session.totalStaked = event.params.totalStake
    session.timeFinalAppraisalSet = event.block.timestamp
    log.info(`total staked final appraisal ${session.totalStaked} for ${session.tokenId}`, [])

    session.save()
  }
}

export function handleuserHarvested(
  event: userHarvested
): void {
  let session = loadPricingSession(event.params.nftAddress_.toHexString(), event.params.tokenid_.toString(), event.params.nonce.toString())
  if (session) {
    
    const sessionAddress = PricingSessionContract.bind(event.address)
    
    const check = sessionAddress.NftSessionCheck(
      event.params.nonce,
      event.params.nftAddress_,
      event.params.tokenid_
    )
    const core = sessionAddress.NftSessionCore(
      event.params.nonce,
      event.params.nftAddress_,
      event.params.tokenid_
    )

    if (check.value4.notEqual(new BigInt(0)) && session.finalAppraisalValue.equals(new BigInt(0))) {
      const finalAppraisalValue = sessionAddress.finalAppraisalValue(
        event.params.nonce,
        event.params.nftAddress_,
        event.params.tokenid_
      )
      session.finalAppraisalValue = finalAppraisalValue
      session.timeFinalAppraisalSet = check.value4
    }
    
    //session.totalStaked = core.value5
    //log.info(`total staked user harvested ${session.totalStaked} for ${session.tokenId}`, [])

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
    session.totalStaked = new BigInt(0)
    session.save()
  }
}

export function handlenewAppraisalAdded(event: newAppraisalAdded): void {
  let session = loadPricingSession(event.params.nftAddress_.toHexString(), event.params.tokenid_.toString(), event.params.nonce.toString())
  const VOTER_ID = event.params.voter_.toHexString() + '/' + event.params.nftAddress_.toHexString() + '/' + event.params.tokenid_.toString() + '/' + event.params.nonce.toString()
  const sessionAddress = PricingSessionContract.bind(event.address)

  let vote = Vote.load(VOTER_ID)
  if (!vote) {
    vote = new Vote(VOTER_ID)
    vote.amountStaked = event.params.stake_
    vote.save()

    let user = User.load(event.params.voter_.toHexString())
    if (!user) {
      user = new User(event.params.voter_.toHexString())
    }
    let votes = user.votes
    votes.push(VOTER_ID)
    user.votes = votes

    const PRICING_SESSION_ID = event.params.nftAddress_.toHexString() + '/' + event.params.tokenid_.toString() + '/' + event.params.nonce.toString()
    let pricingSessions = user.pricingSessionsVotedIn
    pricingSessions.push(PRICING_SESSION_ID)
    user.pricingSessionsVotedIn = pricingSessions
    user.save()
  }

  if (session) {
    const core = sessionAddress.NftSessionCore(
      event.params.nonce,
      event.params.nftAddress_,
      event.params.tokenid_
    )
    
    let participants = session.participants
    participants.push(VOTER_ID)
    session.participants = participants
    session.numParticipants += 1
    session.totalStaked = core.value5
    log.info(`total staked new appraisal added ${session.totalStaked} for ${session.tokenId}`, [])
    session.save()
  }
}

export function handlevoteWeighed(event: voteWeighed): void {
  let session = loadPricingSession(event.params.nftAddress_.toHexString(), event.params.tokenid_.toString(), event.params.nonce.toString())
  const sessionAddress = PricingSessionContract.bind(event.address)
  const check = sessionAddress.NftSessionCheck(
    event.params.nonce,
    event.params.nftAddress_,
    event.params.tokenid_
  )
  const core = sessionAddress.NftSessionCore(
    event.params.nonce,
    event.params.nftAddress_,
    event.params.tokenid_
  )
  if (session) {
    if (session.sessionStatus === 0) {
      session.sessionStatus = 1
    }
    
    if (check.value1 == core.value9 || core.value0.plus(core.value10) < event.block.timestamp) {
      session.sessionStatus = 2
    }
    session.save()
  }

  const VOTER_ID = event.params.user_.toHexString() + '/' + event.params.nftAddress_.toHexString() + '/' + event.params.tokenid_.toString() + '/' + event.params.nonce.toString()

  let vote = Vote.load(VOTER_ID)
  if (vote) {
    vote.weight = vote.amountStaked.div(core.value2).sqrt()
    vote.appraisal = event.params.appraisal
    vote.save()
  }
}
