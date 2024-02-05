/*
import { PrismaClient } from "database";

// Create the prisma client, this automatically connects to the database
const client = new PrismaClient();

// async function main() {
//   const edge = await client.edges.create({
//     data: {
//       edgeID: "WHOO",
//       endNode: "1234",
//       startNode: "4321",
//     },
//   });
//   console.log(edge);
// }

async function main() {
  const edge = await client.highScore.create({
    data: {
      id: 12,
      time: "2024-01-23T00:00:00.000Z",
      score: 13,
    },
  });
  console.log(edge);
}

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });

// Export the client
export default client;

// Prisma automatically closes on shutdown
*/
