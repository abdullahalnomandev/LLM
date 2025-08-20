"use client";
import {
  getAllLectureAccess,
  postLectureProgress,
} from "@/services/lectureAccessService";
import { ILecture } from "@/types/lecture";
import { IModule } from "@/types/module";
import { hasAccessToLecture } from "@/util/courseProgress";
import { Link } from "lucide-react";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FaPlay,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaLock,
  FaEye,
  FaDownload,
} from "react-icons/fa";

const Lecture = ({ modules }: { modules: IModule[] }) => {
  const [currentLecture, setCurrentLecture] = useState(0);
  const [currentModule, setCurrentModule] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [autoplayKey, setAutoplayKey] = useState(0);
  const [completedLecturesIds, setCompletedLecturesIds] = useState<string[]>(
    []
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentLectureData = useMemo(
    () => modules[currentModule]?.lectures[currentLecture],
    [currentModule, currentLecture, modules]
  );

  const totalLectures = useMemo(
    () => modules.reduce((acc, module) => acc + module.lectures.length, 0),
    [modules]
  );

  const percentage = useMemo(() => {
    if (!modules || modules.length === 0) return 0;
    return Math.round((completedLecturesIds.length / totalLectures) * 100);
  }, [completedLecturesIds.length, totalLectures]);

  const selectLecture = (moduleIndex: number, lectureIndex: number) => {
    setCurrentModule(moduleIndex);
    setCurrentLecture(lectureIndex);
    setAutoplayKey((prev) => prev + 1);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  useEffect(() => {
    const fetchLectureAccess = async () => {
      const allAccessLectureIds = await getAllLectureAccess();
      const firstId = modules[0]?.lectures[0]?._id;
      setCompletedLecturesIds([
        ...(firstId ? [firstId] : []),
        ...allAccessLectureIds.map((id) => id.lectureId),
      ]);
    };
    fetchLectureAccess();
  }, [currentLecture, modules]);
  useEffect(() => {
    if (iframeRef.current?.parentNode) {
      const parent = iframeRef.current.parentNode as HTMLElement;
      parent.style.position = "relative";
      parent.style.paddingTop = "56.25%"; // 16:9 aspect ratio

      if (iframeRef.current) {
        iframeRef.current.style.position = "absolute";
        iframeRef.current.style.top = "0";
        iframeRef.current.style.left = "0";
        iframeRef.current.style.width = "100%";
        iframeRef.current.style.height = "100%";
      }
    }
  }, [autoplayKey]);
  const goToNextLecture = async (lectureId: string) => {
    const currentModuleLectures = modules[currentModule]?.lectures;
    const currentLectureIndex = currentModuleLectures.findIndex(
      (lecture) => lecture._id === lectureId
    );

    const nextLectureId =
      currentLectureIndex < currentModuleLectures.length - 1
        ? currentModuleLectures[currentLectureIndex + 1]._id
        : modules[currentModule + 1]?.lectures[0]?._id;

    if (!nextLectureId) return;

    const hasAccess = await hasAccessToLecture(nextLectureId);
    if (!hasAccess) await postLectureProgress(nextLectureId);

    if (currentLectureIndex < currentModuleLectures.length - 1) {
      setCurrentLecture(currentLecture + 1);
    } else if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setCurrentLecture(0);
    }
    setAutoplayKey((prev) => prev + 1);
  };

  const goToPrevLecture = () => {
    if (currentLecture > 0) {
      setCurrentLecture(currentLecture - 1);
    } else if (currentModule > 0) {
      const prevModule = currentModule - 1;
      setCurrentModule(prevModule);
      setCurrentLecture(modules[prevModule].lectures.length - 1);
    }
    setAutoplayKey((prev) => prev + 1);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/"))
      videoId = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("youtube.com/watch?v="))
      videoId = url.split("v=")[1].split("&")[0];
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
      : url;
  };

  const filteredModules = useMemo(() => {
    if (!searchQuery) return modules;
    return modules.filter(
      (module) =>
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.lectures.some((lecture) =>
          lecture.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [modules, searchQuery]);

  if (!modules || modules.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No course data available
          </h2>
          <p className="text-gray-500 mt-2">
            Please check if the modules are loaded correctly.
          </p>
        </div>
      </div>
    );

  console.log({ completedLecturesIds: currentLectureData?.pdf_nodes });

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <FaTimes className="w-5 h-5 text-blue-600" />
              ) : (
                <FaBars className="w-5 h-5 text-blue-600" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900">
                Course Player
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-20 sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-blue-600 font-bold">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] relative">
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Video Player */}
          <div className="flex-1 bg-gray-900 relative overflow-hidden shadow-xl">
            {currentLectureData?.video_url ? (
              <iframe
                key={autoplayKey}
                ref={iframeRef}
                src={getEmbedUrl(currentLectureData.video_url)}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentLectureData?.title}
              />
            ) : (
              <div className="text-white text-center">
                <h3 className="text-xl mb-2">No video available</h3>
                <p className="text-gray-400">
                  Please select a lecture with video content
                </p>
              </div>
            )}
          </div>

          {/* Bottom Control Bar */}
          <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center justify-between gap-8 w-full">
                <button
                  onClick={goToPrevLecture}
                  disabled={currentModule === 0 && currentLecture === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Previous
                </button>
                <button
                  onClick={() => goToNextLecture(currentLectureData?._id)}
                  disabled={
                    currentModule === modules.length - 1 &&
                    currentLecture ===
                      modules[currentModule]?.lectures.length - 1
                  }
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer transform hover:scale-105"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Lecture PDFs Section */}

            {currentLectureData?.pdf_nodes &&
              currentLectureData.pdf_nodes.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">
                    📘 Lecture Resources
                  </h3>
                  <ul className="space-y-3">
                    {currentLectureData.pdf_nodes.map((pdf, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {/* Left side (dot + title) */}
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                          <span
                            title={`Lecture PDF ${index + 1}`}
                            className="text-sm font-medium text-gray-700 truncate max-w-[200px]"
                          >
                            {`Lecture PDF ${index + 1}`}
                          </span>
                        </div>

                        {/* Right side (actions) */}
                        <div className="flex items-center gap-2">
                          <a
                            href={pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 flex items-center gap-1"
                          >
                            <FaEye className="w-3.5 h-3.5" />
                            View
                          </a>
                          <a
                            href={pdf}
                            target="_blank"
                            className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200 flex items-center gap-1"
                          >
                            <FaDownload className="w-3.5 h-3.5" />
                            Download
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <div className="sm:hidden mt-4 flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-blue-600 font-bold text-sm">
                {percentage}%
              </span>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          } fixed lg:relative top-0 right-0 w-80 sm:w-96 lg:w-80 xl:w-96 h-full lg:h-auto bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ease-in-out sm:z-0 z-50 shadow-xl lg:shadow-none ${
            !sidebarOpen ? "lg:w-0 lg:overflow-hidden" : ""
          }`}
        >
          {/* Sidebar Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
            <h3 className="font-bold text-gray-900">Course Content</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <FaTimes className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Lessons"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Course Modules */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredModules.map((module) => {
              const isExpanded = expandedModules.includes(module._id);
              const actualModuleIndex = modules.findIndex(
                (m) => m._id === module._id
              );
              return (
                <div
                  key={module._id}
                  className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                >
                  <button
                    onClick={() => toggleModule(module._id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">
                        {module.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {module.lectures.length} lecture
                        {module.lectures.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <FaChevronDown
                      className={`w-4 h-4 text-gray-400 transition-all duration-200 ${
                        isExpanded ? "rotate-180 text-blue-500" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-gray-100">
                      {module.lectures.map(
                        (lecture: ILecture, lectureIndex) => {
                          const isAccessible = completedLecturesIds.includes(
                            lecture._id
                          );
                          const isCurrent =
                            currentModule === actualModuleIndex &&
                            currentLecture === lectureIndex;

                          return (
                            <button
                              key={lecture._id}
                              disabled={!isAccessible}
                              onClick={() =>
                                selectLecture(actualModuleIndex, lectureIndex)
                              }
                              className={`w-full flex items-center gap-3 p-4 text-left transition-all duration-200 group ${
                                isCurrent
                                  ? "from-blue-50 to-blue-100 border-r-4 border-b border-b-transparent border-blue-500"
                                  : ""
                              } ${
                                !isAccessible
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-blue-50 cursor-pointer"
                              }`}
                            >
                              <div className="flex items-center">
                                {isAccessible ? (
                                  <FaCheckCircle className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                      isCurrent
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-400 group-hover:border-blue-500"
                                    }`}
                                  >
                                    <FaPlay
                                      className={`w-2 h-2 fill-current transition-colors duration-200 ${
                                        isCurrent
                                          ? "text-white"
                                          : "text-gray-400 group-hover:text-blue-500"
                                      }`}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div
                                  className={`text-sm font-semibold truncate transition-colors duration-200 ${
                                    isCurrent
                                      ? "text-blue-700"
                                      : "text-gray-700 group-hover:text-gray-900"
                                  }`}
                                >
                                  {lecture.title}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1 group-hover:text-gray-600 transition-colors">
                                  <div className="flex items-center gap-1">
                                    <FaClock className="w-3 h-3" />
                                    <span>Video</span>
                                  </div>
                                </div>
                              </div>

                              {!isAccessible && (
                                <FaLock className="w-3 h-3 text-gray-400 ml-auto" />
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Lecture;
