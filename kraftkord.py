import streamlit as st
from mido import Message, MidiFile, MidiTrack
import tempfile

moods = {
        "Dreamy" : [["Cmaj7", "Am9", "Fmaj7", "G13"]],
        "Sad" : [["Dm", "Gm", "Bb", "A7"]],
        "Energetic" : [["E", "A", "C#m", "B"]], 
        "Deep House" : [["G#9", "Badd9", "Emaj9", "C#m9"]]
}


# Basic chord to MIDI notes
chord_library = {
    "Cmaj7": [60, 64, 67, 71],
    "Am9": [57, 60, 64, 69],
    "Fmaj7": [53, 57, 60, 64],
    "G13": [55, 59, 62, 67],
    "Dm": [50, 53, 57],
    "Gm": [55, 58, 62],
    "Bb": [58, 62, 65],
    "A7": [57, 61, 64, 69],
    "E": [52, 56, 59],
    "A": [57, 61, 64],
    "C#m": [61, 64, 68],
    "B": [59, 63, 66],
    "G#m9": [56, 59, 63, 68],
    "Badd9": [59, 63, 66, 71],
    "Emaj9": [52, 56, 59, 66],
    "C#m9": [61, 64, 68, 73],
}

st.set_page_config(
    page_title="KordKraft",
    page_icon="🎛️",
    layout="centered",
    initial_sidebar_state="auto",
)


st.markdown("""
  <style>
    /* 1) Load the 3270 font via @font-face */
    @font-face {
      font-family: '3270';
      src: url('https://cdn.jsdelivr.net/gh/rbanffy/3270font/3270-Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    /* 2) Global pitch-black background & neon-green text */
    [data-testid="stAppViewContainer"] {
      background-color: #000 !important;
      color: #0F0 !important;
      font-family: '3270', monospace !important;
    }

    /* 3) Header, sidebar, and main area too */
    [data-testid="stHeader"], [data-testid="stSidebar"] {
      background-color: #000 !important;
      color: #0F0 !important;
      font-family: '3270', monospace !important;
    }

    /* 4) Primary buttons & download button */
    button[kind="primary"], .stDownloadButton>button {
      background-color: #111 !important;
      color: #0F0 !important;
      border: 1px solid #0F0 !important;
      border-radius: 4px !important;
    }
    button[kind="primary"]:hover, .stDownloadButton>button:hover {
      background-color: #222 !important;
    }

    /* 5) Selectbox (input + dropdown items) */
    [data-baseweb="select"] {
      background-color: #111 !important;
      color: #0F0 !important;
      font-family: '3270', monospace !important;
    }
    [data-baseweb="select"] * {
      background-color: #111 !important;
      color: #0F0 !important;
      font-family: '3270', monospace !important;
    }

  </style>
""", unsafe_allow_html=True)

st.title("🎹 Kraft Kord v.1.0.0")


# Mood selector
mood = st.selectbox("Select mood:", list(moods.keys()))

# Show progressions
st.write("### Chord Progression:")
progression = moods[mood][0]
st.markdown(" → ".join(progression))

# Generate MIDI
if st.button("🎼 Generate MIDI"):
    mid = MidiFile()
    track = MidiTrack()
    mid.tracks.append(track)

    for chord in progression:
        notes = chord_library.get(chord, [])
        for note in notes:
            track.append(Message('note_on', note=note, velocity=64, time=0))
        for note in notes:
            track.append(Message('note_off', note=note, velocity=64, time=480))

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mid") as tmp:
        mid.save(tmp.name)
        st.success("MIDI file created!")
        st.download_button("⬇️ Download MIDI", data=open(tmp.name, "rb"), file_name="moodkeys_chords.mid")

