"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../UserContext';
import { User } from '../types'; // Import the User interface

const APP_SCRIPT_POST_URL = "https://script.google.com/macros/s/AKfycbwXIfuadHykMFrMdPPLLP7y0pm4oZ8TJUnM9SMmDp9BkaVLGu9jupU-CuW8Id-Mm1ylxg/exec";

interface Question {
  id: number;
  question: string;
  answer: string;
}

export default function Questions() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [view, setView] = useState<'info' | 'questions'>('info');
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, question: 'Describe a situation where you had to handle a high volume of data entry with strict deadlines. How did you ensure accuracy and efficiency?', answer: '' },
    { id: 2, question: 'How do you handle a situation where a customer is having difficulty understanding your instructions? What techniques do you use to ensure clarity?', answer: '' },
    { id: 3, question: 'Describe a time when you had to actively listen to a customer to understand their needs, even when they were not clearly articulating them. What steps did you take?', answer: '' },
    { id: 4, question: 'Explain your process for verifying the accuracy of data you have entered, especially when dealing with numerical or financial information.', answer: '' },
    { id: 5, question: 'Describe a time when you had to adjust your communication style to suit a particular client or situation. What did you do differently?', answer: '' },
    { id: 6, question: 'How do you prioritize tasks when faced with multiple data entry projects, each with varying deadlines and levels of importance?', answer: '' },
    { id: 7, question: 'Share an experience where your active listening skills helped you uncover a hidden issue or opportunity during a conversation.', answer: '' },
    { id: 8, question: 'What strategies do you use to maintain focus and avoid errors during long periods of repetitive data entry tasks?', answer: '' },
    { id: 9, question: 'Describe a situation where you had to communicate complex information to someone who was not familiar with the topic. How did you ensure they understood?', answer: '' },
    { id: 10, question: 'How do you stay motivated and maintain a high level of accuracy when performing routine data entry tasks day after day?', answer: '' },
  ]);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(() => {
    const unansweredQuestions = questions.filter(q => q.answer.trim() === '');
    if (unansweredQuestions.length > 0 && !confirm('Some questions are unanswered. Do you want to continue submitting?')) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const answers = questions.map(q => ({ question: q.question, answer: q.answer }));
    let payload = new URLSearchParams();
    payload.append("action", "submitAnswers");
    payload.append("userId", user?.userId as string);
    payload.append("interviewResponse", JSON.stringify(answers));
    payload.append("timeOut", dateToExcelSerial(new Date()).toString());

    fetch(APP_SCRIPT_POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString()
    }).then(() => {
      setTimeout(() => {
        setLoading(false);
        router.push('/autonavigate');
      }, 10000); // Ensure loading state for 10 seconds
    });
  }, [questions, user?.userId, router]);

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/invalid');
    }

    if (view === 'questions' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [user, userLoading, view, timeLeft, handleSubmit, router]);

  function dateToExcelSerial(date: Date): number {
    const startDate = new Date(Date.UTC(1899, 11, 30));
    const diff = date.getTime() - startDate.getTime();
    return diff / (1000 * 60 * 60 * 24);
  }

  const startInterview = () => {
    if (email.trim() === '') {
      alert('Please enter your email address.');
      return;
    }

    if (confirm('The timer of 15 minutes is about to start and cannot be terminated. Interview answers will be automatically submitted at the end of the timer. Do you want to proceed?')) {
      setLoading(true);
      let payload = new URLSearchParams();
      payload.append("action", "startInterview");
      payload.append("userId", user?.userId as string);
      payload.append("emailAddress", email);
      payload.append("timeIn", dateToExcelSerial(new Date()).toString());

      fetch(APP_SCRIPT_POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
      }).then(() => {
        //setLoading(false);
        setView('questions');
      });
    }
  };

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {view === 'info' && (
        <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/hotel.jpg)' }}>
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-4xl font-bold text-white mb-6">Welcome to {user?.organization || "Recruiting Resources"}</h1>
            <p className="text-xl text-gray-200 mb-6">Hello {user.fullName}, prepare for your interview.</p>
            <p className="text-lg text-gray-200 mb-6">Position: {user.position}</p>
            <p className="text-lg text-gray-200 mb-6">Phone: {user.phoneNumber}</p>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
            />
            <p className="text-lg text-gray-200 mb-6">The result of your interview will be sent to this email address along with further employment information.</p>
            <button onClick={startInterview} className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-500 transition" disabled={loading}>
              {loading ? 'Starting...' : 'Start Interview'}
            </button>
          </div>
        </section>
      )}

      {view === 'questions' && (
        <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-right text-lg text-gray-600 dark:text-gray-400 mb-4">
              Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Interview Questions</h2>
            </div>
            {questions.map((q, index) => (
              <div key={q.id} className="mb-6">
                <p className="text-lg text-gray-900 dark:text-gray-100 mb-2">{q.question}</p>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                  rows={4}
                  value={q.answer}
                  onChange={e => {
                    const newQuestions = [...questions];
                    newQuestions[index].answer = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  disabled={loading} // Disable textarea when loading
                />
              </div>
            ))}
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-500 transition" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}