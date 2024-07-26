import db from "./db/connection.js";

const resolvers = {
  Proposal: {
    id: (parent) => parent.id ?? parent._id,
  },
  Query: {
    async proposal(_, { id }) {
      let collection = await db.collection("proposals");
      let query = { _id: new ObjectId(id) };

      return await collection.findOne(query);
    },
    async proposals(_, __, context) {
      let collection = await db.collection("proposals");
      const proposals = await collection.find({}).toArray();
      return proposals;
    },
    async approvalById(_, { id }) {
      let collection = await db.collection("approvals");
      let query = { _id: new ObjectId(id) };

      return await collection.findOne(query);
    },
    async approvalByUserId(_, { userId }) {
      let collection = await db.collection("approvals");
      let query = { _userId: userId };

      return await collection.findOne(query);
    },
    async approvals(_, __, context) {
      let collection = await db.collection("approvals");
      const approvals = await collection.find({}).toArray();
      return approvals;
    },
    async approvalsApproved(_, __, context) {
      let collection = await db.collection("approvals");
      let query = { approval: true }; // Filter by isApproved: true
      const approvals = await collection.find(query).toArray();
      return approvals;
    },    
  },
  Mutation: {
    async createProposal(_, { userId, proposalDate }, context) {
      let collection = await db.collection("proposals");
      const insert = await collection.insertOne({ userId, proposalDate });
      if (insert.acknowledged)
        return { userId, proposalDate , id: insert.insertedId };
      return null;
    },
    async deleteProposal(_, { id }, context) {
      let collection = await db.collection("proposals");
      const dbDelete = await collection.deleteOne({ _id: new ObjectId(id) });
      return dbDelete.acknowledged && dbDelete.deletedCount == 1 ? true : false;
    },
    async createApproval(_, { userId, approvalDate, approval }, context) {
      let collection = await db.collection("approvals");
      const insert = await collection.insertOne({ userId, approvalDate, approval });
      if (insert.acknowledged)
        return { userId, approvalDate, approval , id: insert.insertedId };
      return null;
    },
    async deleteApproval(_, { id }, context) {
      let collection = await db.collection("approvals");
      const dbDelete = await collection.deleteOne({ _id: new ObjectId(id) });
      return dbDelete.acknowledged && dbDelete.deletedCount == 1 ? true : false;
    },
  },
};

export default resolvers;