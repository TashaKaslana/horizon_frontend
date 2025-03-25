import DiscoverContainer from "@/app/(home)/discover/DiscoverContainer";

const Page = () => {
  const items = [
      {
          id: "0",
          title: "Discovering the Sea",
          description: "A journey through the vast oceans of the world.",
          src: "https://www.w3schools.com/tags/mov_bbb.mp4",
          avatar: "https://github.com/shadcn.png/",
          author: "JaneDoe",
          username: "janedoe",
          category: "travel",
          tags: ["adventure", "water", "scuba diving"],
          view: 1234,
          timestamp: "2025-02-28T12:00:00Z",
          likes: 750,
          comments: 15,
      },
      {
          id: "1",
          title: "Exploring the Mountains",
          description: "A journey through the majestic landscapes of the Alps.",
          src: "https://www.w3schools.com/tags/mov_bbb.mp4",
          avatar: "https://github.com/shadcn.png/",
          author: "JohnDoe",
          username: "john123",
          category: "education",
          tags: ["adventure", "nature", "hiking"],
          view: 1523,
          timestamp: "2025-03-18T14:30:00Z",
          likes: 875,
          comments: 12,
      },
  ]

  return (
      <>
        <DiscoverContainer posts={items}/>
      </>
  )
}

export default Page