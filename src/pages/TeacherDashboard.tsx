import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { BookOpen, Users, Calendar, BarChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLoading } from "../context/LoadingContext"; 
import { LoadingSpinner } from "../components/LoadingSpinner"; 

interface AssignmentState {
  assignment: {
    assignment_questions: { question: string; topic: string }[];
  };
}

interface Assignment {
  assignment_id: string;
  title: string;
}

interface Class {
  class_id: string;
  class_name: string;
  grade: string;
  section: string;
}

// Dashboard Overview Component
const DashboardOverview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-primary mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <h3 className="text-2xl font-bold text-primary">156</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Courses</p>
              <h3 className="text-2xl font-bold text-primary">8</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming Sessions</p>
              <h3 className="text-2xl font-bold text-primary">12</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <BarChart className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Performance</p>
              <h3 className="text-2xl font-bold text-primary">85%</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Assignment Submitted</p>
                  <p className="text-sm text-gray-600">Student #{i} submitted Math Assignment</p>
                </div>
                <span className="text-sm text-gray-500">2h ago</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Advanced Mathematics</p>
                  <p className="text-sm text-gray-600">Class {i} • 25 Students</p>
                </div>
                <span className="text-sm text-gray-500">9:00 AM</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

// Upload Notes Component
const UploadNotes = () => {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  const { isLoading, showLoading, hideLoading } = useLoading();

  const handleUpload = async () => {
    showLoading();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive",
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("topic", title);
    formData.append("teacher_id", user.id);
    formData.append("file", file);
  
    try {
      const response = await fetch("http://0.0.0.0:8000/upload-notes", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        hideLoading();
        toast({
          title: "Success",
          description: "Note uploaded successfully",
        });
      } else {
        hideLoading();
        toast({
          title: "Error",
          description: data.message || "Upload failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      hideLoading();
      toast({
        title: "Error",
        description: "An error occurred while uploading",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-primary mb-8">Upload Notes</h1>
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Enter note title"
              />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Enter note subject"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              rows={4}
              placeholder="Enter note description"
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>
          <button onClick={handleUpload} className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90">
            Upload Note
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

// Notes List Component
const NotesList = () => {
  const [notes, setNotes] = useState<{ id: string; subject: string; topic: string }[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoading, showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchNotes = async () => {
      showLoading();
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast({ title: "Error", description: "User not logged in", variant: "destructive" });
        return;
      }

      try {
        const response = await fetch(`http://0.0.0.0:8000/notes/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          hideLoading();
          setNotes(data.notes);
        } else {
          hideLoading();
          toast({ title: "Error", description: "Failed to fetch notes", variant: "destructive" });
        }
      } catch (error) {
        hideLoading();
        toast({ title: "Error", description: "An error occurred", variant: "destructive" });
      }
    };

    fetchNotes();
  }, [toast]);

  const handleNoteSelect = (noteId: string) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]
    );
  };

  const handleGenerateAssignment = async () => {
    if (selectedNotes.length === 0) {
      toast({ title: "Error", description: "No notes selected", variant: "destructive" });
      return;
    }
    showLoading();
    console.log(selectedNotes)
    try {
      const response = await fetch("http://0.0.0.0:8000/generate-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedNotes), // Direct array of strings
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        toast({ title: "Success", description: "Assignment generated successfully" });
        navigate("/teacher-dashboard/create-assignment", { state: { assignment: data } });
      } else {
        toast({ title: "Error", description: data.message || "Failed to generate assignment", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred", variant: "destructive" });
    } finally {
      hideLoading();
    }
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />} {
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-8">All Notes</h1>
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                  selectedNotes.includes(note.id) ? "bg-secondary/10" : ""
                }`}
                onClick={() => handleNoteSelect(note.id)}
              >
                <div>
                  <h3 className="font-medium">{note.subject}</h3>
                  <p className="text-sm text-gray-600">{note.topic}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={handleGenerateAssignment}
            className="mt-4 w-full bg-secondary text-white hover:bg-secondary/90"
          >
            Generate Assignment
          </Button>
        </Card>
      </motion.div>
    }
    </div>
  );
};


// Generate Assignment Component
const CreateAssignment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoading, showLoading, hideLoading } = useLoading();
  const location = useLocation() as { state: AssignmentState };
  const assignment = location.state?.assignment;
  const [questions, setQuestions] = useState(
    assignment?.assignment_questions.map((q) => ({ ...q, score: "" })) || []
  );
  const [customTopic, setCustomTopic] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleScoreChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].score = value;
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleAddCustomQuestion = () => {
    if (customTopic.trim() === "") {
      toast({ title: "Error", description: "Please enter a topic", variant: "destructive" });
      return;
    }
    setQuestions([...questions, { question: "", topic: customTopic, score: "" }]);
    setCustomTopic("");
  };

  const handlePublishAssignment = async () => {
    
    showLoading();
    if (assignmentTitle.trim() === "") {
      toast({ title: "Error", description: "Assignment title is required", variant: "destructive" });
      return;
    }
  
    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      topic: q.topic,
      score: q.score || "0", // Default to "0" if score is not provided
    }));
  
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast({ title: "Error", description: "User not logged in", variant: "destructive" });
      return;
    }
  
    try {
      const response = await fetch(
        `http://0.0.0.0:8000/create-assignment?teacher_id=${user.id}&title=${encodeURIComponent(assignmentTitle)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedQuestions),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast({ title: "Success", description: "Assignment published successfully" });
        navigate("/teacher-dashboard/create-assignment", { state: { assignment: data } });
      } else {
        toast({ title: "Error", description: data.message || "Failed to publish assignment", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred", variant: "destructive" });
    } finally {
      hideLoading();
    }
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />} {
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-8">Create Assignment</h1>
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="space-y-6">
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Enter assignment title"
              required
            />
          </div>
            {questions.map((q, index) => (
              <div key={index} className="space-y-2">
                <h2 className="text-l font-semibold text-gray-800">{q.topic}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Score
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={q.score}
                      onChange={(e) => handleScoreChange(index, e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Score"
                      required
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(index)}
                    className="mt-6 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic for Custom Question
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="Enter topic"
                />
              </div>
            </div>
            <button
              onClick={handleAddCustomQuestion}
              className="w-full bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90"
            >
              Add Custom Question
            </button>
            <button
              onClick={handlePublishAssignment}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              Publish Assignment
            </button>
          </div>
        </Card>
      </motion.div>
      }
    </div>   
  );
};

const UpdateAssignment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, showLoading, hideLoading } = useLoading();
  const assignment = location.state?.assignment;

  const [assignmentTitle, setTitle] = useState(assignment?.title || "");
  const [questions, setQuestions] = useState(
    assignment?.questions.map((q) => ({
      question_id: q.question_id,
      question: q.question,
      topic: q.topic,
      score: q.score,
    })) || []
  );
  const [customTopic, setCustomTopic] = useState("");

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleScoreChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].score = value;
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleAddCustomQuestion = () => {
    if (customTopic.trim() === "") {
      toast({ title: "Error", description: "Please enter a topic", variant: "destructive" });
      return;
    }
    setQuestions([...questions, { question: "", topic: customTopic, score: "" }]);
    setCustomTopic("");
  };

  const handleEditAssignment = async () => {
    
    showLoading();
    if (assignmentTitle.trim() === "") {
      toast({ title: "Error", description: "Assignment title is required", variant: "destructive" });
      return;
    }
  
    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      topic: q.topic,
      score: q.score || "0", // Default to "0" if score is not provided
    }));
  
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast({ title: "Error", description: "User not logged in", variant: "destructive" });
      return;
    }
  
    // try {
    //   const response = await fetch(
    //     `http://0.0.0.0:8000/create-assignment?teacher_id=${user.id}&title=${encodeURIComponent(assignmentTitle)}`,
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(formattedQuestions),
    //     }
    //   );
    //   const data = await response.json();
    //   if (response.ok) {
    //     toast({ title: "Success", description: "Assignment published successfully" });
    //     navigate("/teacher-dashboard/create-assignment", { state: { assignment: data } });
    //   } else {
    //     toast({ title: "Error", description: data.message || "Failed to publish assignment", variant: "destructive" });
    //   }
    // } catch (error) {
    //   toast({ title: "Error", description: "An error occurred", variant: "destructive" });
    // } finally {
    //   hideLoading();
    // }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-primary mb-8">Update Assignment</h1>
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Enter assignment title"
              required
            />
          </div>
          {questions.map((q, index) => (
            <div key={q.question_id} className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">{q.topic}</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={q.score}
                    onChange={(e) => handleScoreChange(index, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Score"
                    required
                  />
                </div>
                <button
                  onClick={() => handleDeleteQuestion(index)}
                  className="mt-6 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={handleAddCustomQuestion}
            className="w-full bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90"
          >
            Add Custom Question
          </button>
          <button
            onClick={handleEditAssignment}
            className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Update Assignment
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

const AssignmentsList = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast({ title: "Error", description: "User not logged in", variant: "destructive" });
        return;
      }

      try {
        const response = await fetch(`http://0.0.0.0:8000/teacher-assignments/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setAssignments(data.assignments);
        } else {
          toast({ title: "Error", description: "Failed to fetch assignments", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "An error occurred", variant: "destructive" });
      }
    };

    const fetchClasses = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast({ title: "Error", description: "User not logged in", variant: "destructive" });
        return;
      }

      try {
        const response = await fetch(`http://0.0.0.0:8000/teacher-classes/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setClasses(data.classes);
        } else {
          toast({ title: "Error", description: "Failed to fetch classes", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "An error occurred", variant: "destructive" });
      }
    };

    fetchAssignments();
    fetchClasses();
  }, [toast]);

  const handleAssignmentClick = async (assignmentId: string) => {
    try {
      const response = await fetch(`http://0.0.0.0:8000/assignment/${assignmentId}`);
      const data = await response.json();
      if (response.ok) {
        navigate("/teacher-dashboard/update-assignment", { state: { assignment: data.assignment } });
      } else {
        toast({ title: "Error", description: "Failed to fetch assignment details", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred", variant: "destructive" });
    }
  };

  const handleAssignToClass = async (assignmentId: string, classId: string) => {
    try {
      const response = await fetch(`http://0.0.0.0:8000/assign-assignment/${assignmentId}/${classId}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: "Success", description: "Assignment assigned to class successfully" });
      } else {
        toast({ title: "Error", description: data.message || "Failed to assign assignment", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred", variant: "destructive" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-primary mb-8">My Assignments</h1>
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment.assignment_id}>
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-800">{assignment.title}</h2>
              <br />
              <button
                onClick={() => handleAssignmentClick(assignment.assignment_id)}
                className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90"
              >
                Edit
              </button>
              &nbsp; &nbsp;
              <button
                onClick={() => setSelectedAssignmentId(assignment.assignment_id)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Assign
              </button>
              {selectedAssignmentId === assignment.assignment_id && (
                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Class
                  </label>
                  <select
                    onChange={(e) => handleAssignToClass(assignment.assignment_id, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls.class_id} value={cls.class_id}>
                        {cls.class_name} (Grade {cls.grade}, Section {cls.section})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Main TeacherDashboard Component
const TeacherDashboard = () => {
  return (
    <div>
      <div className="min-h-screen bg-accent">
        <TeacherSidebar />
        <div className="ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="upload-notes" element={<UploadNotes />} />
              <Route path="notes" element={<NotesList />} />
              <Route path="create-assignment" element={<CreateAssignment />} />
              <Route path="update-assignment" element={<UpdateAssignment />} />
              <Route path="assignments" element={<AssignmentsList />} />
              {/* Additional routes will be added for other sections */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
