export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: " John D'Amore",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    quote: "Shughuli has been a game-changer for me. It's so easy to keep track of my tasks and deadlines. I highly recommend it!"
  },
  {
    id: 2,
    name: "Catalina Smith",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    quote: "As a product manager, I love how Shughuli helps me coordinate with different teams. The project tracking features are exceptional!"
  },
  {
    id: 3,
    name: "Michael Torres",
    role: "Team Lead",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    quote: "Managing multiple projects has never been easier. The intuitive interface and collaboration features have improved our team's efficiency by 30%."
  }
];