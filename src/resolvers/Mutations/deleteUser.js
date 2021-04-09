const deleteUser = async (_, __, { tokenData, prisma }) => {
  if (!tokenData) {
    throw new Error("Unauthorized action!");
  }

  // Delete this user's content.
  await prisma.content.deleteMany({
    where: { authorId: tokenData.id },
  });

  const organizedEvents = await prisma.event.findMany({
    where: { organizerId: tokenData.id },
    include: { content: true },
  });

  if (organizedEvents.length > 0) {
    for (const event of organizedEvents) {
      // Delete each of this user's events that doesn't have
      // any content left.
      if (event.content.length < 1) {
        await prisma.event.delete({
          where: { id: event.id },
        });
      }
    }
  }

  // Delete this user.
  return prisma.user.delete({
    where: { id: tokenData.id },
  });
};

export default deleteUser;
