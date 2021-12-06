// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class PricingSession extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("nftAddress", Value.fromString(""));
    this.set("tokenId", Value.fromBigInt(BigInt.zero()));
    this.set("nonce", Value.fromBigInt(BigInt.zero()));
    this.set("finalAppraisalValue", Value.fromBigInt(BigInt.zero()));
    this.set("totalStaked", Value.fromBigInt(BigInt.zero()));
    this.set("timeFinalAppraisalSet", Value.fromBigInt(BigInt.zero()));
    this.set("bounty", Value.fromBigInt(BigInt.zero()));
    this.set("votingTime", Value.fromBigInt(BigInt.zero()));
    this.set("endTime", Value.fromBigInt(BigInt.zero()));
    this.set("sessionStatus", Value.fromI32(0));
    this.set("maxAppraisal", Value.fromBigInt(BigInt.zero()));
    this.set("participants", Value.fromStringArray(new Array(0)));
    this.set("numParticipants", Value.fromI32(0));
    this.set("createdAt", Value.fromBigInt(BigInt.zero()));
    this.set("creator", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save PricingSession entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save PricingSession entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("PricingSession", id.toString(), this);
    }
  }

  static load(id: string): PricingSession | null {
    return changetype<PricingSession | null>(store.get("PricingSession", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get nftAddress(): string {
    let value = this.get("nftAddress");
    return value!.toString();
  }

  set nftAddress(value: string) {
    this.set("nftAddress", Value.fromString(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get nonce(): BigInt {
    let value = this.get("nonce");
    return value!.toBigInt();
  }

  set nonce(value: BigInt) {
    this.set("nonce", Value.fromBigInt(value));
  }

  get finalAppraisalValue(): BigInt {
    let value = this.get("finalAppraisalValue");
    return value!.toBigInt();
  }

  set finalAppraisalValue(value: BigInt) {
    this.set("finalAppraisalValue", Value.fromBigInt(value));
  }

  get totalStaked(): BigInt {
    let value = this.get("totalStaked");
    return value!.toBigInt();
  }

  set totalStaked(value: BigInt) {
    this.set("totalStaked", Value.fromBigInt(value));
  }

  get timeFinalAppraisalSet(): BigInt {
    let value = this.get("timeFinalAppraisalSet");
    return value!.toBigInt();
  }

  set timeFinalAppraisalSet(value: BigInt) {
    this.set("timeFinalAppraisalSet", Value.fromBigInt(value));
  }

  get bounty(): BigInt {
    let value = this.get("bounty");
    return value!.toBigInt();
  }

  set bounty(value: BigInt) {
    this.set("bounty", Value.fromBigInt(value));
  }

  get votingTime(): BigInt {
    let value = this.get("votingTime");
    return value!.toBigInt();
  }

  set votingTime(value: BigInt) {
    this.set("votingTime", Value.fromBigInt(value));
  }

  get endTime(): BigInt {
    let value = this.get("endTime");
    return value!.toBigInt();
  }

  set endTime(value: BigInt) {
    this.set("endTime", Value.fromBigInt(value));
  }

  get sessionStatus(): i32 {
    let value = this.get("sessionStatus");
    return value!.toI32();
  }

  set sessionStatus(value: i32) {
    this.set("sessionStatus", Value.fromI32(value));
  }

  get maxAppraisal(): BigInt {
    let value = this.get("maxAppraisal");
    return value!.toBigInt();
  }

  set maxAppraisal(value: BigInt) {
    this.set("maxAppraisal", Value.fromBigInt(value));
  }

  get participants(): Array<string> {
    let value = this.get("participants");
    return value!.toStringArray();
  }

  set participants(value: Array<string>) {
    this.set("participants", Value.fromStringArray(value));
  }

  get numParticipants(): i32 {
    let value = this.get("numParticipants");
    return value!.toI32();
  }

  set numParticipants(value: i32) {
    this.set("numParticipants", Value.fromI32(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value!.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get creator(): string {
    let value = this.get("creator");
    return value!.toString();
  }

  set creator(value: string) {
    this.set("creator", Value.fromString(value));
  }
}

export class Vote extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("amountStaked", Value.fromBigInt(BigInt.zero()));
    this.set("appraisal", Value.fromBigInt(BigInt.zero()));
    this.set("weight", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Vote entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Vote entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Vote", id.toString(), this);
    }
  }

  static load(id: string): Vote | null {
    return changetype<Vote | null>(store.get("Vote", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get user(): string {
    let value = this.get("user");
    return value!.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }

  get pricingSession(): string {
    let value = this.get("pricingSession");
    return value!.toString();
  }

  set pricingSession(value: string) {
    this.set("pricingSession", Value.fromString(value));
  }

  get amountStaked(): BigInt {
    let value = this.get("amountStaked");
    return value!.toBigInt();
  }

  set amountStaked(value: BigInt) {
    this.set("amountStaked", Value.fromBigInt(value));
  }

  get appraisal(): BigInt {
    let value = this.get("appraisal");
    return value!.toBigInt();
  }

  set appraisal(value: BigInt) {
    this.set("appraisal", Value.fromBigInt(value));
  }

  get weight(): BigInt {
    let value = this.get("weight");
    return value!.toBigInt();
  }

  set weight(value: BigInt) {
    this.set("weight", Value.fromBigInt(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("votes", Value.fromStringArray(new Array(0)));
    this.set("pricingSessionsVotedIn", Value.fromStringArray(new Array(0)));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save User entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save User entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("User", id.toString(), this);
    }
  }

  static load(id: string): User | null {
    return changetype<User | null>(store.get("User", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get votes(): Array<string> {
    let value = this.get("votes");
    return value!.toStringArray();
  }

  set votes(value: Array<string>) {
    this.set("votes", Value.fromStringArray(value));
  }

  get pricingSessionsVotedIn(): Array<string> {
    let value = this.get("pricingSessionsVotedIn");
    return value!.toStringArray();
  }

  set pricingSessionsVotedIn(value: Array<string>) {
    this.set("pricingSessionsVotedIn", Value.fromStringArray(value));
  }

  get creatorOf(): Array<string> {
    let value = this.get("creatorOf");
    return value!.toStringArray();
  }

  set creatorOf(value: Array<string>) {
    this.set("creatorOf", Value.fromStringArray(value));
  }
}
