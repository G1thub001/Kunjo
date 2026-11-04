
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  tagline: string;
}

export const collections: Collection[] = [
  {
    id: "COL-001",
    name: "The Classics",
    slug: "the-classics",
    description:
      "Timeless pieces designed to become part of your everyday story.",
    image: "/images/beimg.png",
    tagline: "Elegance, without effort.",
  },
  {
    id: "COL-002",
    name: "The Gem Edit",
    slug: "the-gem-edit",
    description:
      "A celebration of colour, character and the natural beauty of gemstones.",
    image: "/images/cac.png",
    tagline: "A little colour. A lot of character.",
  },
  {
    id: "COL-003",
    name: "The Signatures",
    slug: "the-signatures",
    description:
      "Distinctive designs created for those who appreciate the finer details.",
    image: "/images/beimg3.png",
    tagline: "Made to leave an impression.",
  },
];
