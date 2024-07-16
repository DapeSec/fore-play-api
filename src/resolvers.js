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
  },
  Mutation: {
    async createProposal(_, { userId, proposalDate }, context) {
      let collection = await db.collection("proposals");
      const insert = await collection.insertOne({ userId, proposalDate  });
      if (insert.acknowledged)
        return { userId, proposalDate , id: insert.insertedId };
      return null;
    },
    async deleteProposal(_, { id }, context) {
      let collection = await db.collection("proposals");
      const dbDelete = await collection.deleteOne({ _id: new ObjectId(id) });
      return dbDelete.acknowledged && dbDelete.deletedCount == 1 ? true : false;
    },
  },
};

export default resolvers;