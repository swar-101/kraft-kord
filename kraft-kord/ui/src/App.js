import React, { useState, useEffect, useCallback } from 'react';
import { saveAs } from 'file-saver';
import * as Tone from 'tone';
import './App.css';
import { ReactComponent as DownloadIcon } from './midi-download-icon.svg';

const moods = {
  Dreamy: ['Cmaj7', 'Am9', 'Fmaj7', 'G13'],
  Sad: ['Dm', 'Gm', 'Bb', 'A7'],
  Energetic: ['E', 'A', 'C#m', 'B'],
  'Deep House': ['G#m9', 'Badd9', 'Emaj9', 'C#m9'],
  'Ambient': ['Dmaj9', 'Bm7', 'Gmaj7', 'Em9'],
  'Jazz': ['Dm7', 'G7', 'Cmaj7', 'A7'],
  'Blues': ['A7', 'D7', 'E7', 'A7'],
  'Cinematic': ['Em', 'C', 'G', 'D'],
  'Lo-Fi': ['Fmaj7', 'Dm7', 'Bb7', 'C7'],
  'Neo-Soul': ['F#m7', 'Bmaj7', 'E7', 'Amaj7']
};

const instruments = {
  'Grand Piano': {
    type: 'sampler',
    settings: {
      urls: {
        A0: "A0.mp3", C1: "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
        A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
        A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
        A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
        A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
        A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
        A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
        A7: "A7.mp3", C8: "C8.mp3"
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/"
    }
  },
  'Strings': {
    type: 'synth',
    settings: {
      oscillator: { 
        type: "sine",
        modulationType: "sine",
        modulationIndex: 0.2,
        harmonicity: 0.5
      },
      envelope: {
        attack: 1.5,
        decay: 0.5,
        sustain: 0.4,
        release: 2
      },
      filter: {
        type: "lowpass",
        frequency: 800,
        rolloff: -24,
        Q: 0.5
      },
      volume: -12
    },
    effects: [
      {
        type: "compressor",
        threshold: -24,
        ratio: 4,
        attack: 0.1,
        release: 0.2
      },
      {
        type: "eq3",
        low: 2,
        mid: -4,
        high: -8,
        lowFrequency: 200,
        highFrequency: 2000
      }
    ]
  },
  'Electric': {
    type: 'synth',
    settings: {
      oscillator: { 
        type: "sawtooth",
        modulationType: "square",
        modulationIndex: 0.3,
        harmonicity: 0.5
      },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.3,
        release: 1
      },
      filter: {
        type: "lowpass",
        frequency: 600,
        rolloff: -24,
        Q: 1
      },
      filterEnvelope: {
        attack: 0.2,
        decay: 0.3,
        sustain: 0.4,
        release: 1,
        baseFrequency: 200,
        octaves: 1.5
      },
      volume: -10
    },
    effects: [
      {
        type: "compressor",
        threshold: -20,
        ratio: 6,
        attack: 0.1,
        release: 0.2
      },
      {
        type: "eq3",
        low: 4,
        mid: -2,
        high: -6,
        lowFrequency: 150,
        highFrequency: 1500
      }
    ]
  },
  'Synth': {
    type: 'synth',
    settings: {
      oscillator: { 
        type: "triangle",
        modulationType: "sine",
        modulationIndex: 0.4,
        harmonicity: 0.5
      },
      envelope: {
        attack: 0.2,
        decay: 0.4,
        sustain: 0.3,
        release: 1.5
      },
      filter: {
        type: "lowpass",
        frequency: 400,
        rolloff: -24,
        Q: 0.8
      },
      filterEnvelope: {
        attack: 0.2,
        decay: 0.3,
        sustain: 0.4,
        release: 1,
        baseFrequency: 150,
        octaves: 2
      },
      volume: -8
    },
    effects: [
      {
        type: "compressor",
        threshold: -18,
        ratio: 8,
        attack: 0.1,
        release: 0.2
      },
      {
        type: "eq3",
        low: 6,
        mid: -4,
        high: -4,
        lowFrequency: 100,
        highFrequency: 1000
      }
    ]
  },
  'Pad': {
    type: 'synth',
    settings: {
      oscillator: { 
        type: "sine",
        modulationType: "sine",
        modulationIndex: 0.3,
        harmonicity: 0.5
      },
      envelope: {
        attack: 2,
        decay: 1,
        sustain: 0.6,
        release: 3
      },
      filter: {
        type: "lowpass",
        frequency: 500,
        rolloff: -24,
        Q: 0.5
      },
      filterEnvelope: {
        attack: 1,
        decay: 0.5,
        sustain: 0.3,
        release: 2,
        baseFrequency: 200,
        octaves: 2
      },
      volume: -12
    },
    effects: [
      {
        type: "compressor",
        threshold: -24,
        ratio: 4,
        attack: 0.1,
        release: 0.2
      },
      {
        type: "eq3",
        low: 4,
        mid: -2,
        high: -4,
        lowFrequency: 200,
        highFrequency: 2000
      }
    ]
  }
};

// Using MIDI note numbers for preview functionality
const chordLibrary = {
  Cmaj7: [60, 64, 67, 71],  // C4, E4, G4, B4
  Am9: [57, 60, 64, 69],    // A3, C4, E4, G4
  Fmaj7: [53, 57, 60, 64],  // F3, A3, C4, E4
  G13: [55, 59, 62, 67],    // G3, B3, D4, E4
  Dm: [50, 53, 57],         // D3, F3, A3
  Gm: [55, 58, 62],         // G3, Bb3, D4
  Bb: [58, 62, 65],         // Bb3, D4, F4
  A7: [57, 61, 64, 69],     // A3, C#4, E4, G4
  E: [52, 56, 59],          // E3, G#3, B3
  A: [57, 61, 64],          // A3, C#4, E4
  'C#m': [61, 64, 68],      // C#4, E4, G#4
  B: [59, 63, 66],          // B3, D#4, F#4
  'G#m9': [56, 59, 63, 68], // G#3, B3, D#4, F#4
  Badd9: [59, 63, 66, 71],  // B3, D#4, F#4, C#5
  Emaj9: [52, 56, 59, 66],  // E3, G#3, B3, D#4
  'C#m9': [61, 64, 68, 73], // C#4, E4, G#4, B4
  Dmaj9: [50, 54, 57, 64],  // D3, F#3, A3, E4
  Bm7: [59, 62, 66, 69],    // B3, D4, F#4, A4
  Gmaj7: [55, 59, 62, 66],  // G3, B3, D4, F#4
  Em9: [52, 55, 59, 64],    // E3, G3, B3, D4
  Dm7: [50, 53, 57, 60],    // D3, F3, A3, C4
  G7: [55, 59, 62, 65],     // G3, B3, D4, F4
  D7: [50, 54, 57, 60],     // D3, F#3, A3, C4
  E7: [52, 56, 59, 62],     // E3, G#3, B3, D4
  'F#m7': [54, 57, 61, 64],   // F#3, A3, C#4, E4
  Bmaj7: [59, 63, 66, 70],  // B3, D#4, F#4, A#4
  Amaj7: [57, 61, 64, 68],  // A3, C#4, E4, G#4
  Fmaj7: [53, 57, 60, 64],  // F3, A3, C4, E4
  Dm7: [50, 53, 57, 60],    // D3, F3, A3, C4
  Bb7: [58, 62, 65, 68],    // Bb3, D4, F4, Ab4
  C7: [60, 64, 67, 70]      // C4, E4, G4, Bb4
};

function App() {
  const [mood, setMood] = useState('Dreamy');
  const [instrument, setInstrument] = useState('Grand Piano');
  const [synth, setSynth] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reverb, setReverb] = useState(null);
  const [effects, setEffects] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Memoize the note name conversion
  const getNoteName = useCallback((note) => {
    const octave = Math.floor(note / 12) - 1;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteName = noteNames[note % 12];
    return `${noteName}${octave}`;
  }, []);

  // Memoize the chord playing function
  const playChord = useCallback((chordName, time) => {
    const notes = chordLibrary[chordName] || [];
    if (notes.length === 0) return;

    const noteNames = notes.map(getNoteName);
    const rootNote = noteNames[0];
    const bassNote = rootNote.replace(/\d+/, (match) => parseInt(match) - 1);

    // Play the bass note with lower velocity for subtlety
    synth.triggerAttackRelease(bassNote, "1n", Tone.now() + time, 0.5);
    // Play the full chord
    synth.triggerAttackRelease(noteNames, "1n", Tone.now() + time);
  }, [synth, getNoteName]);

  // Setup instrument with proper cleanup
  useEffect(() => {
    const setupInstrument = async () => {
      // Clean up previous setup
      if (synth) synth.dispose();
      if (reverb) reverb.dispose();
      effects.forEach(effect => effect.dispose());
      setEffects([]);

      const currentInstrument = instruments[instrument];
      let newSynth;

      if (currentInstrument.type === 'sampler') {
        newSynth = new Tone.Sampler(currentInstrument.settings);
      } else {
        newSynth = new Tone.PolySynth(Tone.Synth, currentInstrument.settings);
      }

      // Create reverb
      const newReverb = new Tone.Reverb({
        decay: 2.5,
        wet: 0.3
      }).toDestination();

      // Create effects chain
      const newEffects = [];
      if (currentInstrument.effects) {
        currentInstrument.effects.forEach(effect => {
          let effectNode;
          switch (effect.type) {
            case "compressor":
              effectNode = new Tone.Compressor(effect);
              break;
            case "eq3":
              effectNode = new Tone.EQ3(effect);
              break;
          }
          if (effectNode) {
            newEffects.push(effectNode);
          }
        });
      }

      // Connect the chain: synth -> effects -> reverb -> destination
      let lastNode = newSynth;
      newEffects.forEach(effect => {
        lastNode.connect(effect);
        lastNode = effect;
      });
      lastNode.connect(newReverb);

      setSynth(newSynth);
      setReverb(newReverb);
      setEffects(newEffects);

      return () => {
        if (newSynth) newSynth.dispose();
        if (newReverb) newReverb.dispose();
        newEffects.forEach(effect => effect.dispose());
      };
    };

    setupInstrument();
  }, [instrument]);

  const playProgression = useCallback(async () => {
    if (isPlaying || !synth) return;
    
    setIsPlaying(true);
    await Tone.start();
    
    // Clear any existing scheduled events
    Tone.Transport.cancel();
    
    // Schedule all chords
    moods[mood].forEach((chordName, index) => {
      const time = index;
      playChord(chordName, time);
    });
    
    // Stop after all chords have played
    const totalDuration = moods[mood].length;
    setTimeout(() => {
      setIsPlaying(false);
    }, totalDuration * 1000);
  }, [mood, isPlaying, synth, playChord]);

  const generateMidi = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/generate-midi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: mood,
          chords: moods[mood]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate MIDI');
      }

      const data = await response.json();
      const byteArray = new Uint8Array(data.data);
      const blob = new Blob([byteArray], { type: 'audio/midi' });
      saveAs(blob, data.filename);
    } catch (error) {
      console.error('Error generating MIDI:', error);
      alert('Failed to generate MIDI file. Please make sure the backend server is running.');
    }
  }, [mood]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && !isPlaying) {
        e.preventDefault();
        playProgression();
      }
      
      if (e.ctrlKey && e.code === 'Enter') {
        e.preventDefault();
        generateMidi();
      }

      if (!e.ctrlKey && !isPlaying) {
        const moodKeys = Object.keys(moods);
        const currentMoodIndex = moodKeys.indexOf(mood);
        
        switch(e.code) {
          case 'KeyJ':
            e.preventDefault();
            setMood(moodKeys[(currentMoodIndex - 1 + moodKeys.length) % moodKeys.length]);
            break;
          case 'KeyK':
            e.preventDefault();
            setMood(moodKeys[(currentMoodIndex + 1) % moodKeys.length]);
            break;
        }

        const instrumentKeys = Object.keys(instruments);
        const currentInstrumentIndex = instrumentKeys.indexOf(instrument);
        
        switch(e.code) {
          case 'KeyD':
            e.preventDefault();
            setInstrument(instrumentKeys[(currentInstrumentIndex - 1 + instrumentKeys.length) % instrumentKeys.length]);
            break;
          case 'KeyF':
            e.preventDefault();
            setInstrument(instrumentKeys[(currentInstrumentIndex + 1) % instrumentKeys.length]);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, playProgression, mood, instrument, generateMidi]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="theme-switcher">
        <button 
          className={`theme-button ${isDarkMode ? 'dark' : 'light'}`}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          <span className="material-symbols-outlined">visibility</span>
          <div className="switch-container">
            <div className={`switch ${isDarkMode ? 'on' : 'off'}`}>
              <div className="switch-handle"></div>
            </div>
          </div>
        </button>
      </div>

      <div className="title-container">
        <h1 className="title">Kraft Kord</h1>
        <div className="info-icon">
          <span className="material-symbols-outlined">info</span>
          <div className="shortcuts-tooltip">
            <h3>Keyboard Shortcuts</h3>
            <ul>
              <li>Space: Play preview</li>
              <li>J/K: Previous/Next mood</li>
              <li>D/F: Previous/Next sound</li>
              <li>Ctrl+Enter: Download MIDI</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="palette-container">
        <h2>Mood</h2>
        <div className="palette">
          {Object.keys(moods).map(m => (
            <button
              key={m}
              className={`palette-item ${mood === m ? 'active' : ''} ${isPlaying ? 'inactive' : ''}`}
              onClick={() => setMood(m)}
              disabled={isPlaying}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="palette-container">
        <h2>Sound</h2>
        <div className="palette">
          {Object.keys(instruments).map(i => (
            <button
              key={i}
              className={`palette-item ${instrument === i ? 'active' : ''} ${isPlaying ? 'inactive' : ''}`}
              onClick={() => setInstrument(i)}
              disabled={isPlaying}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button 
          className={`play-button ${isPlaying ? 'inactive' : ''}`}
          onClick={playProgression}
          disabled={isPlaying}
        >
          <span className="material-symbols-outlined">hearing</span>
        </button>
        <button 
          className="download-button"
          onClick={generateMidi}
        >
          <DownloadIcon className="download-svg" />
        </button>
      </div>
    </div>
  );
}

export default App;
