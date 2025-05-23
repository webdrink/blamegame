import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '../core/Input';
import { Button } from '../core/Button';
import { Player } from '../../types';
import { ArrowLeft, UserPlus, Trash2 } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

interface PlayerSetupScreenProps {
  players: Player[];
  tempPlayerName: string;
  nameInputError: string | null;
  onPlayerNameChange: (id: string, name: string) => void;
  onRemovePlayer: (id: string) => void;
  onTempPlayerNameChange: (name: string) => void;
  onAddPlayer: () => void;
  onStartGame: () => void;
  onBackToIntro: () => void;
}

/**
 * PlayerSetupScreen component allows users to set up players before starting the game.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<{ id: string; name: string }>} props.players - The list of current players.
 * @param {string} props.tempPlayerName - The temporary name input for a new player.
 * @param {string | null} props.nameInputError - Error message for the player name input, if any.
 * @param {(name: string) => void} props.onTempPlayerNameChange - Handler for updating the temporary player name input.
 * @param {() => void} props.onAddPlayer - Handler for adding a new player to the list.
 * @param {(id: string) => void} props.onRemovePlayer - Handler for removing a player by ID.
 * @param {() => void} props.onStartGame - Handler for starting the game.
 * @param {() => void} props.onBackToIntro - Handler for navigating back to the intro screen.
 *
 * @returns {JSX.Element} The rendered player setup screen.
 */
const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({
  players,
  tempPlayerName,
  nameInputError,
  onPlayerNameChange,
  onRemovePlayer,
  onTempPlayerNameChange,
  onAddPlayer,
  onStartGame,
  onBackToIntro,
}) => {
  const { t } = useTranslation();
  
  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPlayerName.trim() === '') return; 
    onAddPlayer();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md p-6 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border-2 border-pink-100"
    >
      <div className="flex justify-between items-center mb-6">        <Button onClick={onBackToIntro} className="text-purple-600 hover:text-purple-800 bg-transparent hover:bg-purple-50 p-2">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-2xl font-bold text-purple-700">{t('players.setup_title')}</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <form onSubmit={handleAddPlayerSubmit} className="space-y-4 mb-6">
        <div className="flex space-x-2 items-start">
          <Input
            type="text"
            value={tempPlayerName}
            onChange={(e) => onTempPlayerNameChange(e.target.value)}            placeholder={t('players.player_name')}
            className={`flex-grow border-pink-300 focus:border-pink-500 focus:ring-pink-500 ${nameInputError ? 'border-red-500' : ''}`}
            aria-label={t('players.player_name_input')}
          />
          <Button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2"            aria-label={t('players.add_player')}
            disabled={tempPlayerName.trim() === ''}
          >
            <UserPlus size={20} />
          </Button>
        </div>
        {nameInputError && <p className="text-red-500 text-sm -mt-2 ml-1">{nameInputError}</p>}
      </form>

      <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200"
          >
            <span className="text-purple-700 font-medium">{player.name}</span>
            <Button
              onClick={() => onRemovePlayer(player.id)}
              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-red-100 p-1.5"              aria-label={t('players.remove_player', { name: player.name })}
            >
              <Trash2 size={18} />
            </Button>
          </motion.div>
        ))}        {players.length === 0 && (
          <p className="text-center text-purple-500 py-4">{t('players.add_players_to_start')}</p>
        )}
      </div>

      <Button
        onClick={onStartGame}        disabled={players.length < 2} // Typically NameBlame needs at least 2, often 3 for good gameplay
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg rounded-lg shadow-md transition-transform hover:scale-105 duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {t('players.start_game', { count: players.length })}
      </Button>
      {players.length < 2 && ( // Adjust message based on actual minimum
        <p className="text-center text-sm text-pink-600 mt-2">{t('players.minimum_players_needed')}</p>
      )}
    </motion.div>
  );
};

export default PlayerSetupScreen;
