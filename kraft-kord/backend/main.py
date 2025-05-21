from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import mido
from mido import MidiFile, MidiTrack, Message, MetaMessage
import io

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChordRequest(BaseModel):
    mood: str
    chords: List[str]

# Chord library with MIDI note numbers
chord_library = {
    'Cmaj7': [60, 64, 67, 71],  # C4, E4, G4, B4
    'Am9': [57, 60, 64, 69],    # A3, C4, E4, G4
    'Fmaj7': [53, 57, 60, 64],  # F3, A3, C4, E4
    'G13': [55, 59, 62, 67],    # G3, B3, D4, E4
    'Dm': [50, 53, 57],         # D3, F3, A3
    'Gm': [55, 58, 62],         # G3, Bb3, D4
    'Bb': [58, 62, 65],         # Bb3, D4, F4
    'A7': [57, 61, 64, 69],     # A3, C#4, E4, G4
    'E': [52, 56, 59],          # E3, G#3, B3
    'A': [57, 61, 64],          # A3, C#4, E4
    'C#m': [61, 64, 68],        # C#4, E4, G#4
    'B': [59, 63, 66],          # B3, D#4, F#4
    'G#m9': [56, 59, 63, 68],   # G#3, B3, D#4, F#4
    'Badd9': [59, 63, 66, 71],  # B3, D#4, F#4, C#5
    'Emaj9': [52, 56, 59, 66],  # E3, G#3, B3, D#4
    'C#m9': [61, 64, 68, 73],   # C#4, E4, G#4, B4
}

@app.post("/generate-midi")
async def generate_midi(request: ChordRequest):
    # Create a new MIDI file
    mid = MidiFile()
    track = MidiTrack()
    mid.tracks.append(track)

    # Set tempo (120 BPM)
    track.append(MetaMessage('set_tempo', tempo=mido.bpm2tempo(120)))

    # Set time signature (4/4)
    track.append(MetaMessage('time_signature', numerator=4, denominator=4))

    # Add each chord
    for i, chord_name in enumerate(request.chords):
        notes = chord_library.get(chord_name, [])
        
        # Note on for all notes in the chord
        for note in notes:
            track.append(Message('note_on', note=note, velocity=100, time=0))
        
        # Note off for all notes in the chord after 1 beat
        for note in notes:
            track.append(Message('note_off', note=note, velocity=0, time=480))

    # Save MIDI to bytes
    midi_bytes = io.BytesIO()
    mid.save(file=midi_bytes)
    midi_bytes.seek(0)

    # Convert bytes to list for JSON serialization
    midi_data = list(midi_bytes.getvalue())

    return {
        "filename": f"{request.mood}_chords.mid",
        "data": midi_data
    } 