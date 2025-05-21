from mido import Message, Midifile, Miditrack

chords = [
    [57, 60, 64, 67],       # Am7: A3-C4-E4-G4
    [62, 65, 69, 72, 74],   # Dm9: D4-F4-A4-C5-E5
    [65, 69, 72, 76],       # Fmaj7: F4-A4-C5-E5
    [64, 68, 71, 74]        # E7: E4-G#4-B4-D5
]

mid = MidiFile()
track = MidiTrack()
mid.tracks.append(track)

time_per_chord = 480  # 1 bar at 120 BPM

for chord in chords:
    for note in chord:
        track.append(Message('note_on', note=note, velocity=64, time=0))
    for note in chord:
        track.append(Message('note_off', note=note, velocity=64, time=time_per_chord))

# Save the MIDI file
mid.save('piano_progression.mid')
