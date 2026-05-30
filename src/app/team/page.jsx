"use client";
import { Linkedin } from "lucide-react";

const team = [
  {
    name: "Kshitij Kumar",
    role: "Vice chairperson",
    img: "kshitij_img.jpeg",
    linkedin: "https://www.linkedin.com/in/kshitij-kumar612/",
  },
  {
    name: "Harsh Raj",
    role: "Treasrure",
    img: "harsh_img.jpeg",
    linkedin: "https://www.linkedin.com/in/harsh-raj-88a065253/",
  },
  {
    name: "Bhaskar Jha",
    role: "Teach Lead",
    img: "https://media.licdn.com/dms/image/v2/D5635AQESYMrk3TqOEw/profile-framedphoto-shrink_400_400/B56ZnPM_YnJoAc-/0/1760117913743?e=1765555200&v=beta&t=tCt25M9VQbEH5sDQ1fHPg48jr0Zr60uniWaAuA6LxDg",
    linkedin: "https://www.linkedin.com/in/bhaxkar/",
  },
  {
    name: "Manish Chaurasiya",
    role: "PR Head",
    img: "https://media.licdn.com/dms/image/v2/D5635AQH_W_5IeXS4BA/profile-framedphoto-shrink_400_400/B56ZfMW4mSG0Ag-/0/1751480240894?e=1765555200&v=beta&t=Jh1YxQsj9IfV8FDpoEjEAUyO1oJQ2QMdXpjsB79-xmQ",
    linkedin: "https://www.linkedin.com/in/manish-kumar-chaurasia-058624263/",
  },
  {
    name: "Sharad Singh",
    role: "Web Master",
    img: "sharad_img.jpeg",
    linkedin: "https://www.linkedin.com/in/sharad-singh-b47678260/",
  },
  {
    name: "Avik Danger",
    role: "Secretry",
    img: "avik_img.jpeg",
    linkedin: "https://www.linkedin.com/in/avik-dangar-02565a253/",
  },
  {
    name: "Aditya Sahoo",
    role: "Member ship Chair",
    img: "aditya_img.jpeg",
    linkedin: "https://www.linkedin.com/in/aditya-sahoo-579789257/",
  },
  {
    name: "Shreya Prasad",
    role: "Chair Person Women",
    img: "https://media.licdn.com/dms/image/v2/D5603AQEOv_wr9SrNxw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709303428649?e=1766620800&v=beta&t=emBmTUSbuwh2zPEVHVXI7nSmfyLTW6OEStxFejpymIM",
    linkedin: "https://www.linkedin.com/in/shreya-prasad-86505b2b8/",
  },
  {
    name: "Shreya Rani Dey",
    role: "Design Head",
    img: "https://media.licdn.com/dms/image/v2/D5635AQE9g21vZkXW9Q/profile-framedphoto-shrink_400_400/B56Zl1MDRBKMAc-/0/1758607717879?e=1765555200&v=beta&t=_Npu2tSAc-hb1pisPWCA_zpv0eK5Pz9HPSw-eFCAceg",
    linkedin: "https://www.linkedin.com/in/sreya-rani-dey-b4600925a/",
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      {/* Title */}
      <h1 className="text-center text-5xl md:text-6xl font-extrabold mb-14">
        Meet Our{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Core Team
        </span>
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {team.map((member, i) => (
          <div
            key={i}
            className="group rounded-3xl p-6 bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-blue-500/20 transition-all hover:-translate-y-3"
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl mb-6">
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-64 object-cover rounded-2xl group-hover:scale-105 transition-all duration-300"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Info */}
            <h3 className="text-2xl font-bold">{member.name}</h3>
            <p className="text-blue-300 mb-4">{member.role}</p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a
                href={member.linkedin}
                className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
