import {
  ImageIcon,
  Search,
  MessageSquareText,
  WandSparklesIcon,
  MessageCircleQuestionMarkIcon,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: WandSparklesIcon,
    title: "AI Writing Assistant",
    description:
      "Get intelligent suggestions and improvements for your technical posts. Let AI help you articulate complex concepts clearly.",
  },
  {
    icon: ImageIcon,
    title: "AI Image Generator",
    description:
      "Create custom visuals and diagrams for your posts. Generate illustrations that perfectly match your content.",
  },
  {
    icon: MessageSquareText,
    title: "Smart Community Chat",
    description:
      "Connect with developers worldwide in real-time. Share knowledge, ask questions, and build meaningful connections.",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Find relevant content instantly with AI-powered search. Discover posts, discussions, and resources that matter to you.",
  },
  {
    icon: TrendingUp,
    title: "Follow Trending Topics",
    description:
      "Track your content's performance with detailed insights. Understand your audience and optimize your reach.",
  },
  {
    icon: MessageCircleQuestionMarkIcon,
    title: "Q&A Knowledge Hub",
    description:
      "Ask and answer technical questions with ease. Leverage community expertise to solve problems faster.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="
        py-24 
        bg-[#F8FAFC] 
        dark:bg-gray-800 
        transition-all duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className="
              inline-block px-4 py-2 
              bg-blue-50 text-text-light
              rounded-full mb-6
              dark:bg-blue-900/50 
              dark:text-blue-400
            "
          >
            Features
          </div>

          <h2
            className="
              text-[#0F172A] 
              mb-6

              dark:text-white
            "
            style={{
              fontWeight: 800,
              fontSize: "3rem",
              lineHeight: "1.1",
            }}
          >
            Everything You Need to Succeed
          </h2>

          <p
            className="
              text-[#475569]

              dark:text-gray-400
            "
            style={{
              fontWeight: 400,
              fontSize: "1.125rem",
              lineHeight: "1.7",
            }}
          >
            Powerful tools designed to enhance your productivity and creativity
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                bg-white 
                p-8 rounded-2xl shadow-md 
                hover:shadow-xl transition-all duration-300 hover:-translate-y-1 
                border border-gray-100

                dark:bg-gray-900 
                dark:border-gray-700 
                dark:shadow-gray-700/50
              "
            >
              <div
                className="
                  w-14 h-14 
                  bg-linear-to-br from-text-light to-primary
                  rounded-xl flex items-center justify-center mb-6

                  dark:bg-text-dark
                "
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3
                className="
                  text-[#0F172A] mb-3

                  dark:text-white
                "
                style={{
                  fontWeight: 700,
                  fontSize: "1.25rem",
                }}
              >
                {feature.title}
              </h3>

              <p
                className="
                  text-[#64748B]

                  dark:text-gray-400
                "
                style={{
                  fontWeight: 400,
                  fontSize: "1rem",
                  lineHeight: "1.6",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
