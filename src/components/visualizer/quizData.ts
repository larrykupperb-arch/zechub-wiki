import type { QuizQuestion } from "./QuizModule";

export const QUIZ_BEGINNER: QuizQuestion[] = [
  {
    question: "What do Zcash wallets provide for users?",
    options: ["Only transparent addresses", "Shielded functionality", "Mining only", "Exchange listing"],
    correctIndex: 1,
  },
  {
    question: "How can you get ZEC in a permissionless way?",
    options: ["Only from banks", "Through centralized exchanges only", "Using decentralized exchanges (DEX)", "ZEC cannot be bought"],
    correctIndex: 2,
  },
  {
    question: "Which shielded pool was introduced by the NU6.3 network upgrade?",
    options: ["Sprout", "Sapling", "Orchard", "Ironwood"],
    correctIndex: 3,
  },
  {
    question: "What does a zk-SNARK proof demonstrate in a shielded transaction?",
    options: ["The transaction amount publicly", "Valid ownership without revealing details", "Only the sender address", "Mining reward"],
    correctIndex: 1,
  },
  {
    question: "Where can you typically use ZEC for payments?",
    options: ["Only on one website", "Nowhere", "At merchants and services that accept ZEC", "Only in mining"],
    correctIndex: 2,
  },
  {
    question: "What does Zcash infrastructure refer to?",
    options: ["Only one server", "How nodes, wallets, and network components work together", "Only websites", "Only mining pools"],
    correctIndex: 1,
  },
];

export const QUIZ_INTERMEDIATE: QuizQuestion[] = [
  {
    question: "What is Halo 2 used for in Zcash?",
    options: ["Mining only", "Recursive zero-knowledge proofs", "Wallet storage", "Exchange trading"],
    correctIndex: 1,
  },
  {
    question: "What are privacy use cases on Zcash?",
    options: ["Only personal use", "Real-world applications of privacy technology", "Only for miners", "There are none"],
    correctIndex: 1,
  },
  {
    question: "How is Zcash development funded?",
    options: ["Only by one company", "Through governance and the Dev Fund", "Only by miners", "Exchanges only"],
    correctIndex: 1,
  },
  {
    question: "What role do hash functions play in Zcash?",
    options: ["Mining rewards only", "Integrity, commitments, and binding data", "Only for addresses", "Display names"],
    correctIndex: 1,
  },
  {
    question: "In a shielded Zcash transaction, what does the zk-SNARK proof allow a sender to demonstrate?",
    options: [
      "Their full wallet balance to the recipient",
      "Valid ownership and transaction correctness without revealing private inputs",
      "The memo contents to all network observers",
      "Which pool the funds originated from",
    ],
    correctIndex: 1,
  },
  {
    question: "After NU6.3 activation, which statement about the Orchard pool is accurate?",
    options: [
      "New value can still enter Orchard normally",
      "Orchard was deleted from the chain",
      "No new value may enter Orchard; funds can exit toward Ironwood",
      "Orchard became a transparent-only pool",
    ],
    correctIndex: 2,
  },
  {
    question: "In a FROST t-of-n threshold signature scheme, how many participants must cooperate to produce a valid signature?",
    options: [
      "All n participants every time",
      "At least t participants",
      "Exactly one trusted coordinator",
      "A simple majority, regardless of t",
    ],
    correctIndex: 1,
  },
  {
    question: "What makes a FROST signature private on Zcash?",
    options: [
      "It hides the transaction amount on its own",
      "It is indistinguishable from an ordinary single-key Schnorr signature, so observers can't tell a group signed",
      "It publishes each signer's share on-chain",
      "It only works with transparent addresses",
    ],
    correctIndex: 1,
  },
  {
    question: "What does a value pool turnstile reveal?",
    options: [
      "The sender and receiver of every transaction",
      "Nothing at all — it is fully shielded",
      "The amount of value crossing between pools, while sender and receiver stay private",
      "Each user's total balance",
    ],
    correctIndex: 2,
  },
  {
    question: "Why was the Ironwood pool introduced in NU6.3?",
    options: [
      "To lower transaction fees",
      "To open a clean pool and seal Orchard behind a turnstile so supply can be audited after the circuit bug",
      "To replace proof-of-work with proof-of-stake",
      "To remove shielded transactions entirely",
    ],
    correctIndex: 1,
  },
];
