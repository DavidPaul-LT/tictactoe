import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trophy, X, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccess } from "@/utils/toast";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

const calculateWinner = (board: Board): { winner: Player; line: number[] } | null => {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: combo };
    }
  }
  return null;
};

const isBoardFull = (board: Board): boolean => board.every((cell) => cell !== null);

export const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [winner, setWinner] = useState<{ winner: Player; line: number[] } | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winningLine, setWinningLine] = useState<number[]>([]);

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result);
      setWinningLine(result.line);
      setScores((prev) => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
      showSuccess(`¡Jugador ${result.winner} ha ganado! 🎉`);
    } else if (isBoardFull(board)) {
      setIsDraw(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      showSuccess("¡Empate! Buen juego 🤝");
    }
  }, [board]);

  const handleCellClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
    setWinningLine([]);
  };

  const resetScores = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const getCellContent = (index: number) => {
    const value = board[index];
    if (!value) return null;
    return value === "X" ? (
      <X className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-500 stroke-[3]" />
    ) : (
      <Circle className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500 stroke-[3]" />
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
            Tres en Raya
          </h1>
          <Sparkles className="w-6 h-6 text-amber-500" />
        </div>
        <p className="text-sm text-slate-500">El clásico juego de estrategia</p>
      </div>

      {/* Scoreboard */}
      <Card className="p-4 sm:p-6 mb-6 border-2 border-slate-100 shadow-sm bg-white/80 backdrop-blur">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className={cn(
            "text-center p-3 rounded-xl transition-all duration-300",
            currentPlayer === "X" && !winner && !isDraw
              ? "bg-indigo-50 ring-2 ring-indigo-400 scale-105"
              : "bg-slate-50"
          )}>
            <X className="w-6 h-6 text-indigo-500 stroke-[3] mx-auto mb-1" />
            <div className="text-2xl sm:text-3xl font-bold text-slate-800">{scores.X}</div>
            <div className="text-xs text-slate-500 mt-1">Jugador X</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-amber-50">
            <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
            <div className="text-2xl sm:text-3xl font-bold text-slate-800">{scores.draws}</div>
            <div className="text-xs text-slate-500 mt-1">Empates</div>
          </div>
          <div className={cn(
            "text-center p-3 rounded-xl transition-all duration-300",
            currentPlayer === "O" && !winner && !isDraw
              ? "bg-rose-50 ring-2 ring-rose-400 scale-105"
              : "bg-slate-50"
          )}>
            <Circle className="w-6 h-6 text-rose-500 stroke-[3] mx-auto mb-1" />
            <div className="text-2xl sm:text-3xl font-bold text-slate-800">{scores.O}</div>
            <div className="text-xs text-slate-500 mt-1">Jugador O</div>
          </div>
        </div>
      </Card>

      {/* Game Board */}
      <Card className="p-3 sm:p-4 mb-6 border-2 border-slate-100 shadow-lg bg-white">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 aspect-square">
          {board.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!board[index] || !!winner || isDraw}
              className={cn(
                "aspect-square rounded-2xl border-2 transition-all duration-300 flex items-center justify-center",
                "bg-gradient-to-br from-slate-50 to-white",
                "hover:from-indigo-50 hover:to-rose-50 hover:border-indigo-300 hover:scale-[1.02]",
                "active:scale-95",
                "disabled:cursor-not-allowed",
                winningLine.includes(index)
                  ? "border-amber-400 bg-amber-50 animate-pulse"
                  : "border-slate-200",
                !board[index] && !winner && !isDraw && "cursor-pointer"
              )}
              aria-label={`Celda ${index + 1}`}
            >
              <div className="animate-in zoom-in duration-300">
                {getCellContent(index)}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Status Message */}
      <div className="text-center mb-6 min-h-[3rem] flex items-center justify-center">
        {winner ? (
          <Badge className="text-base px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0 shadow-md">
            🏆 ¡Jugador {winner.winner} gana!
          </Badge>
        ) : isDraw ? (
          <Badge className="text-base px-4 py-2 bg-gradient-to-r from-slate-400 to-slate-500 text-white border-0 shadow-md">
            🤝 ¡Empate!
          </Badge>
        ) : (
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-sm">Turno de:</span>
            {currentPlayer === "X" ? (
              <X className="w-6 h-6 text-indigo-500 stroke-[3]" />
            ) : (
              <Circle className="w-6 h-6 text-rose-500 stroke-[3]" />
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={resetGame}
          variant="default"
          size="lg"
          className="rounded-full px-6 shadow-md bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Nueva Partida
        </Button>
        <Button
          onClick={resetScores}
          variant="outline"
          size="lg"
          className="rounded-full px-6 border-2"
        >
          Reiniciar Marcador
        </Button>
      </div>
    </div>
  );
};