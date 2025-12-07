import { UserPlus, PenTool, Share2, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Create an Account",
    description:
      "Sign up in seconds and join our vibrant community of developers and tech enthusiasts.",
  },
  {
    number: 2,
    icon: PenTool,
    title: "Write or Record",
    description:
      "Create creative posts with our AI-powered editor. Generate visuals and get writing assistance.",
  },
  {
    number: 3,
    icon: Share2,
    title: "Publish & Connect",
    description:
      "Share your knowledge with the community. Engage in discussions and grow your network.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-white dark:bg-gray-900 transition-all duration-300 min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className="inline-block px-4 py-2 bg-blue-50 text-text-light dark:bg-blue-900/50 dark:text-blue-400 rounded-full mb-6"
            
          >
            Process
          </div>

          <h2
            className="text-gray-900 dark:text-white mb-6 text-4xl md:text-5xl font-extrabold tracking-tight"
             
          >
            How It Works
          </h2>

          <p
            className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed"
             
          >
            Get started with DevHub in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Arrow Between Steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-[calc(100%+0.5rem)] transform -translate-x-1/2 -translate-y-1/2 z-0">
                  <ArrowRight className="w-10 h-10 text-blue-600/30 dark:text-blue-400/30" />
                </div>
              )}

              {/* Step Card */}
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl border-2 border-gray-100 dark:border-gray-700 hover:border-text-light dark:hover:border-text-light transition-all duration-300 hover:shadow-xl relative z-10">
                {/* Number Badge */}
                <div
                  className="absolute -top-4 -left-4 w-12 h-12 bg-text-light text-white rounded-full flex items-center justify-center shadow-lg font-extrabold text-xl"
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mb-6 mt-4 shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700">
                  <step.icon className="w-8 h-8 text-text-light dark:text-text-dark" />
                </div>

                {/* Content */}
                <h3
                  className="text-gray-900 dark:text-white mb-3 text-2xl font-bold"
                   
                >
                  {step.title}
                </h3>

                <p
                  className="text-gray-600 dark:text-gray-400 leading-relaxed"
                   
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
