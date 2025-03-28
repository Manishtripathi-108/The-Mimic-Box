export type PlayerData = {
    id: string | null;
    name: string;
    score: number;
};

export type GameMode = 'classic' | 'ultimate';

export type BoardState = ('X' | 'O' | 'D' | null)[];

export type TicTacToeGameState = {
    gameMode: GameMode;
    classicBoardState: BoardState;
    ultimateBoardState: BoardState[];

    isFetching: boolean;
    awaitingOpponent: boolean;
    playerSymbol: 'X' | 'O' | null;
    gameRoomId: string | null;
    gameRoomName: string | null;
    hasGameStarted: boolean;

    isNextX: boolean;
    hasGameEnded: boolean;
    gameWinner: string | null;
    winningIndexes: number[] | null;
    isStalemate: boolean;
    stalemateCount: number;
    activeCellIndex: number | null;
    playerXData: PlayerData;
    playerOData: PlayerData;
};

export type TicTacToeActions =
    | { type: 'SET_MODE'; payload: GameMode }
    | { type: 'UPDATE_PLAYER'; payload: { player: 'X' | 'O'; name: string } }
    | { type: 'MAKE_MOVE'; payload: { macroIndex: number; cellIndex?: number } }
    | { type: 'TOGGLE_ONLINE'; payload: boolean }
    | { type: 'UPDATE_STATE'; payload: Partial<TicTacToeGameState> }
    | { type: 'TOGGLE_LOADING'; payload: boolean }
    | { type: 'RESTART_SOFT' }
    | { type: 'RESET_HARD' };

export type TicTacToeGameContext = {
    resetBoard: () => void;
    connect: () => void;
    createRoom: (mode: GameMode, playerName: string) => void;
    disconnect: () => void;
    makeMove: (macroIndex: number, cellIndex?: number) => void;
    joinRoom: (gameRoomId: string, playerName: string) => void;
    leaveRoom: () => void;
    setMode: (gameMode: 'classic' | 'ultimate') => void;
    setLoading: (loading: boolean) => void;
    setPlayers: (player: 'X' | 'O', name: string) => void;
    startMatch: () => void;
    restartGame: () => void;
    state: TicTacToeGameState;
};
