import { useState, useMemo, useEffect } from 'react';
import DayRow from './components/DayRow';
import Summary from './components/Summary';
import ProgressChart from './components/ProgressChart';
import Auth from './components/Auth';
import Header from './components/Header';
import { DAYS_OF_WEEK, calculateDailyHours, DayData } from './utils/timeCalculations';
import { 
  getCurrentUser, 
  setCurrentUser, 
  saveUser, 
  findUserByUsername,
  logoutUser,
  saveWeekData,
  loadWeekData,
  User
} from './utils/userAuth';
import styles from './App.module.css';

function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(getCurrentUser());
  const [weekData, setWeekData] = useState<DayData[]>(
    DAYS_OF_WEEK.map(day => ({
      day,
      sessions: [{ checkIn: '', checkOut: '' }],
    }))
  );

  // Load user's saved data when they log in
  useEffect(() => {
    if (currentUser) {
      const savedData = loadWeekData(currentUser.id);
      if (savedData) {
        setWeekData(savedData);
      }
    }
  }, [currentUser]);

  // Auto-save week data whenever it changes
  useEffect(() => {
    if (currentUser) {
      saveWeekData(currentUser.id, weekData);
    }
  }, [weekData, currentUser]);

  const totalHours = useMemo(() => {
    return weekData.reduce((total, dayData) => {
      const dayTotal = dayData.sessions.reduce((sum, session) => {
        return sum + calculateDailyHours(session.checkIn, session.checkOut);
      }, 0);
      return total + dayTotal;
    }, 0);
  }, [weekData]);

  const updateSession = (
    dayIndex: number, 
    sessionIndex: number, 
    field: 'checkIn' | 'checkOut', 
    value: string
  ) => {
    setWeekData(prev => {
      const newData = [...prev];
      const newSessions = [...newData[dayIndex].sessions];
      newSessions[sessionIndex] = { ...newSessions[sessionIndex], [field]: value };
      newData[dayIndex] = { ...newData[dayIndex], sessions: newSessions };
      return newData;
    });
  };

  const addSession = (dayIndex: number) => {
    setWeekData(prev => {
      const newData = [...prev];
      newData[dayIndex] = {
        ...newData[dayIndex],
        sessions: [...newData[dayIndex].sessions, { checkIn: '', checkOut: '' }]
      };
      return newData;
    });
  };

  const removeSession = (dayIndex: number, sessionIndex: number) => {
    setWeekData(prev => {
      const newData = [...prev];
      const newSessions = newData[dayIndex].sessions.filter((_, i) => i !== sessionIndex);
      newData[dayIndex] = { ...newData[dayIndex], sessions: newSessions };
      return newData;
    });
  };

  const handleLogin = (username: string, email: string) => {
    let user = findUserByUsername(username);
    
    if (!user) {
      // New user - sign up
      user = saveUser(username, email);
    }
    
    setCurrentUser(user);
    setCurrentUserState(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUserState(null);
    setWeekData(DAYS_OF_WEEK.map(day => ({
      day,
      sessions: [{ checkIn: '', checkOut: '' }],
    })));
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <Header username={currentUser.username} onLogout={handleLogout} />

        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <div className={styles.daysSection}>
              <h2 className={styles.sectionTitle}>Daily Check-ins</h2>
              <div className={styles.daysList}>
                {weekData.map((dayData, index) => (
                  <DayRow
                    key={dayData.day}
                    day={dayData.day}
                    sessions={dayData.sessions}
                    onSessionChange={(sessionIndex, field, value) => 
                      updateSession(index, sessionIndex, field, value)
                    }
                    onAddSession={() => addSession(index)}
                    onRemoveSession={(sessionIndex) => removeSession(index, sessionIndex)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <Summary totalHours={totalHours} />
            <ProgressChart totalHours={totalHours} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
