import { Gift, Clock, BookOpen, CheckCircle } from "lucide-react";

const ChapterMapView = ({ courseLayout }) => (
  <div className="flex flex-col items-center py-6">
    {courseLayout?.chapters.map((chapter, index) => (
      <div key={index} className="flex flex-col items-center w-full max-w-3xl">
        {/* Chapter Card */}
        <div className="w-full max-w-lg bg-gradient-to-r from-green-600/70 to-green-700/50  p-5 rounded-xl shadow-md text-white">
          <div className="text-xs font-medium opacity-90 mb-1">
            Chapter {index + 1}
          </div>
          <h2 className="text-xl font-bold mb-3">{chapter.chapterName}</h2>
          <div className="flex items-center justify-between text-sm border-t border-white/20 pt-3">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {chapter?.duration}
            </span>
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {chapter?.topics?.length} topics
            </span>
          </div>
        </div>

        {/* Topics Timeline */}
        <div className="w-full">
          {chapter?.topics.map((topic, topicIndex) => (
            <div className="flex flex-col items-center w-full" key={topicIndex}>
              {/* Connector Line */}
              <div className="w-0.5 h-10 bg-gray-300"></div>

              {/* Topic Row */}
              <div className="flex items-center gap-6 w-full max-w-3xl px-4">
                {/* Left Side Topic */}
                <div
                  className={`flex-1 text-right ${
                    topicIndex % 2 === 0 ? "" : "invisible"
                  }`}
                >
                  <div className="inline-block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-700">{topic}</p>
                  </div>
                </div>

                {/* Center Circle */}
                <div className="flex items-center justify-center min-w-[3rem] h-12 font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-full shadow">
                  {topicIndex + 1}
                </div>

                {/* Right Side Topic */}
                <div
                  className={`flex-1 ${
                    topicIndex % 2 !== 0 ? "" : "invisible"
                  }`}
                >
                  <div className="inline-block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-700">{topic}</p>
                  </div>
                </div>
              </div>

              {/* Chapter Assessment */}
              {topicIndex === chapter?.topics?.length - 1 && (
                <>
                  <div className="w-0.5 h-10 bg-gray-300"></div>
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-100 border-2 border-purple-300 rounded-full shadow">
                    <Gift className="w-7 h-7 text-purple-600" />
                  </div>
                  <div className="w-0.5 h-10 bg-gray-300"></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    ))}

    {/* Finish Badge */}
    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 rounded-xl shadow-md text-white">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5" />
        <h2 className="text-lg font-bold">Course Complete!</h2>
      </div>
    </div>
  </div>
);

export default ChapterMapView;
