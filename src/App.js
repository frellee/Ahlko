import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CodeGenerator from './CodeGenerator';
import Photobooth from './Photobooth';

const App = () => {
  const [room, setRoom] = useState(null);

  return (
    <Router>
      <div>
        <h1>Long Distance Photobooth</h1>
        <Routes>
          <Route
            path="/"
            element={<CodeGenerator onJoin={(code) => setRoom(code)} />}
          />
          {room && (
            <Route path="/booth" element={<Photobooth />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
