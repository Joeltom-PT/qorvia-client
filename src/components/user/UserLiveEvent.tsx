import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { MessageCircle } from "lucide-react";
import LiveStreamPlayer from "./LiveStreamPlayer";
import SocketService from "../../services/SocketService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getStreamKey } from "../../redux/action/userActions";
import { toast } from "react-toastify";

interface Comment {
  userId: number;
  message: string;
}

const avatars = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
  "https://i.pravatar.cc/100?img=5",
];

const UserLiveEvent: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>(); 
  const eventId = id; 
  const userId = useSelector((state: RootState) => state.user.user?.email);

  const dispatch = useDispatch<AppDispatch>();

  const fetchStreamKey = async () => {
    try {
      if(eventId){
        const response = await dispatch(getStreamKey({ id: eventId })).unwrap();
        setStreamKey(response);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } 
  }

  useEffect(() => {

    if (!user.user || !user.user.email) {
      navigate("/");
    }

    fetchStreamKey();

    SocketService.connect();

    if (userId && eventId) {
      SocketService.joinRoom(eventId, userId);
    }

    SocketService.onMessage((comment: Comment) => {
      setComments((prev) => [...prev, comment]);
    });

    return () => {
      SocketService.disconnect();
    };
  }, [eventId, userId]);

  const sendMessage = () => {
    if (!newComment.trim()) return;

    const comment = {
      userId,
      message: newComment,
    };

    if (userId && eventId) {
      SocketService.sendMessage(eventId, userId, newComment);
    }
    setNewComment("");
  };

  const handleEmojiSelect = (emoji: any) => {
    setNewComment((prev) => prev + emoji.native);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-[8px] overflow-hidden shadow-xl">
              {
                streamKey != null && <LiveStreamPlayer streamKey={streamKey} />
              }
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-[8px] shadow-xl h-[calc(100vh-2rem)] flex flex-col">
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-400" />
                  Comments
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <div className="space-y-4 py-4">
                  {comments.map((comment, index) => (
                    <div key={index} className="flex gap-3">
                      <img
                        src={avatars[comment.userId % avatars.length]}
                        alt={`User ${comment.userId}`}
                        className="w-10 h-10 rounded-[4px] object-cover ring-2 ring-purple-500/20"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-100">
                            Anonymous User {comment.userId}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 mt-1">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-slate-700 mt-auto">
                <div className="flex gap-2 relative">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 bg-slate-700 text-slate-100 rounded-[4px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-slate-400"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="px-2 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-[4px] transition-colors font-medium"
                  >
                    😊
                  </button>
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-[4px] transition-colors font-medium"
                  >
                    Send
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-[60px] right-0 z-50">
                      <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLiveEvent;
