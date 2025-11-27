import { useState, key } from "react";
import Mapbox from "./Mapbox";
import { FiX, FiSend, FiMessageCircle, FiPlus } from "react-icons/fi";

export default function App() {
  // Full demo reset key
  const [demoKey, setDemoKey] = useState(0);

  const [active, setActive] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const suggestedInterests = ["F1", "Coffee", "AI", "Gaming", "Music"];
  const trendingInterests = ["Blockchain", "Climate", "Space", "NFTs"];
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState("");

  const [showRestart, setShowRestart] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, fromUser: true }]);
    setInput("");
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests((prev) => [...prev, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const startSimulatedChat = () => {
    setMessages([]);
    setShowRestart(false);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Have time for a quick 15min coffee to talk about F1?", fromUser: false },
      ]);
    }, 200);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Yeah I'll come to your location!", fromUser: true },
      ]);
    }, 1200);

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Great!", fromUser: false }]);
      setTimeout(() => {
        setShowChat(false);
        setShowRestart(true); // show restart button
      }, 4000);
    }, 2200);
  };

  const restartDemo = () => {
    // Reset all app state
    setActive(true);
    setProfileOpen(false);
    setShowSuggestion(false);
    setShowChat(false);
    setMessages([]);
    setInput("");
    setSelectedInterests([]);
    setCustomInterest("");
    setShowRestart(false);

    // Force Mapbox remount & dot animation restart by updating demoKey
    setDemoKey((prev) => prev + 1);
  };

  return (
    <div className="w-screen h-screen relative font-sans bg-gray-50">
      {/* Map with dynamic key to trigger full restart */}
      <Mapbox key={demoKey} onReachedDestination={() => setShowSuggestion(true)} chatOpen={showChat} />

      {/* Top-left Active + Profile */}
      <div className="absolute top-4 left-4 z-50 flex gap-2 items-center">
        <button
          onClick={() => setActive(!active)}
          className={`relative px-4 py-2 rounded-full shadow text-sm font-medium transition flex items-center justify-center
            ${active 
              ? "bg-green-500 text-white hover:bg-green-600 ring-4 ring-green-300 ring-offset-1"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400 ring-0"
            }`}
        >
          {active ? "Active" : "Inactive"}
        </button>

        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-white hover:ring-2 hover:ring-pink-400 transition flex items-center justify-center"
        >
          <img
            src="https://i.pravatar.cc/100"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* Modern Profile Panel (same style as chat/suggestion) */}
      {profileOpen && (
        <div className="absolute top-16 left-4 z-50 w-80 p-6 bg-black/30 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col transform -translate-x-0 border border-white/20 animate-pop overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-white text-lg">Profile</h2>
            <button onClick={() => setProfileOpen(false)}>
              <FiX className="text-white" />
            </button>
          </div>

          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg mb-4 self-center">
            <img
              src="https://i.pravatar.cc/100"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-white font-semibold">Areas of Interest</p>

            <div className="flex flex-wrap gap-2">
              {suggestedInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    selectedInterests.includes(interest)
                      ? "bg-pink-500 text-white shadow-lg"
                      : "bg-white/20 text-white/80 hover:bg-white/30"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add custom..."
                className="flex-1 px-3 py-1 rounded-full border border-white/30 bg-black/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-sm"
              />
              <button
                onClick={addCustomInterest}
                className="p-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full text-white hover:scale-105 hover:shadow-lg transition flex items-center justify-center"
              >
                <FiPlus size={18} />
              </button>
            </div>

            <div className="mt-2">
              <p className="text-white/70 text-sm mb-1">Trending</p>
              <div className="flex flex-wrap gap-2">
                {trendingInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      selectedInterests.includes(interest)
                        ? "bg-pink-500 text-white shadow-lg"
                        : "bg-white/20 text-white/80 hover:bg-white/30"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {selectedInterests.length > 0 && (
              <p className="text-white/70 text-sm mt-2">
                Selected: {selectedInterests.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Chat, Suggestion, Reopen Buttons */}
      {!showChat && messages.length > 0 && !showRestart && (
        <button
          onClick={() => setShowChat(true)}
          className="absolute bottom-6 right-4 z-50 bg-pink-500/90 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-500 transition flex items-center gap-2"
        >
          <FiMessageCircle size={20} /> Chat
        </button>
      )}

      {showSuggestion && !showChat && (
        <div className="absolute bottom-24 left-1/2 z-50 w-80 p-6 bg-black/30 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col items-center transform -translate-x-1/2 animate-pop border border-white/20">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg mb-3">
            <img
              src="https://i.pravatar.cc/100?img=32"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-center font-bold text-white text-lg mb-2">
            Someone who likes subjects: "F1" is within range!
          </p>
          <p className="text-center text-white/70 text-sm mb-6">
            Suggest meeting?
          </p>

          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={() => {
                setShowSuggestion(false);
                setShowChat(true);
                startSimulatedChat();
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition transform"
            >
              Accept
            </button>

            <button
              onClick={() => setShowSuggestion(false)}
              className="flex-1 px-6 py-3 bg-white/20 text-white/80 font-semibold rounded-2xl shadow hover:scale-105 hover:shadow-md transition transform"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {showChat && (
        <div className="absolute bottom-16 left-1/2 z-50 w-80 h-96 bg-black/30 backdrop-blur-lg shadow-2xl rounded-3xl flex flex-col overflow-hidden transform -translate-x-1/2 animate-pop border border-white/20">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-black/40 backdrop-blur-md">
            <h2 className="font-semibold text-white">Chat</h2>
            <button onClick={() => setShowChat(false)}>
              <FiX size={20} className="text-white"/>
            </button>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] px-4 py-2 rounded-2xl transition-all duration-300 break-words ${
                  msg.fromUser
                    ? "bg-pink-500 text-white self-end shadow-lg"
                    : "bg-white/20 text-white self-start shadow"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 border-t border-white/20 bg-black/40 backdrop-blur-md">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-sm bg-black/20 text-white placeholder-white/70"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full text-white hover:scale-105 hover:shadow-lg transition"
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Restart Demo Button */}
      {showRestart && (
        <button
          onClick={restartDemo}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition"
        >
          Aja demo uuestaan!
        </button>
      )}
    </div>
  );
}
