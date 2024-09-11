import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [shuffling, setShuffling] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const intervalRef = useRef(null);

  // Initialize the deck on component mount
  useEffect(() => {
    async function fetchDeck() {
      try {
        const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        setDeckId(response.data.deck_id);
      } catch (error) {
        console.error('Error initializing deck:', error);
      }
    }

    fetchDeck();
  }, []);

  const drawCard = async () => {
    if (deckId) {
      try {
        const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        if (response.data.remaining === 0) {
          alert('Error: no cards remaining!');
        } else {
          setCards(prevCards => [...prevCards, response.data.cards[0]]);
        }
      } catch (error) {
        console.error('Error drawing card:', error);
      }
    }
  };

  const shuffleDeck = async () => {
    if (deckId && !shuffling) {
      setShuffling(true);
      try {
        await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
        setCards([]);
        setShuffling(false);
      } catch (error) {
        console.error('Error shuffling deck:', error);
        setShuffling(false);
      }
    }
  };

  const startDrawing = () => {
    if (drawing) {
      setDrawing(false);
      clearInterval(intervalRef.current);
    } else {
      setDrawing(true);
      intervalRef.current = setInterval(() => {
        drawCard();
      }, 1000);
    }
  };

  return (
    <div className="App">
      <h1>Deck of Cards</h1>
      <button onClick={shuffleDeck} disabled={shuffling}>Shuffle the Deck</button>
      <button onClick={startDrawing}>
        {drawing ? 'Stop Drawing' : 'Start Drawing'}
      </button>
      <div className="card-container">
        {cards.map((card, index) => (
          <img key={index} src={card.image} alt={`${card.value} of ${card.suit}`} />
        ))}
      </div>
    </div>
  );
}

export default App;