import cn from '@/lib/utils/cn';

type RulesVariant = 'overview' | 'classic' | 'ultimate' | 'online';

type RuleSet = {
    title: string;
    subtitle: string;
    items: string[];
};

const RULE_SETS: Record<Exclude<RulesVariant, 'overview'>, RuleSet> = {
    classic: {
        title: 'Classic Rules',
        subtitle: '3x3 grid, fast rounds.',
        items: [
            'Players alternate placing X and O on the 3x3 grid.',
            'Get 3 in a row (row, column, or diagonal) to win.',
            'If all 9 cells are filled with no winner, the game is a draw.',
        ],
    },
    ultimate: {
        title: 'Ultimate Rules',
        subtitle: 'Win mini boards to claim the big board.',
        items: [
            'The board is 9 mini boards, each a 3x3 game.',
            'Win a mini board to claim that square on the big board; draws lock it as a draw.',
            'Your move sends your opponent to the mini board that matches the cell you chose.',
            'If that target mini board is already decided, the next player can choose any open mini board.',
            'Win by getting 3 claimed mini boards in a row; draw if all mini boards are decided.',
        ],
    },
    online: {
        title: 'Online Play',
        subtitle: 'Play classic or ultimate with friends.',
        items: [
            'Create a room or join one with a room ID.',
            'Pick classic or ultimate; rules follow the chosen mode.',
            'Take turns and wait for your turn indicator before moving.',
            'Use Start Over or Change Player Name to reset between rounds.',
        ],
    },
};

const TicTacToeRules = ({ variant = 'overview' }: { variant?: RulesVariant }) => {
    const ruleKeys: Exclude<RulesVariant, 'overview'>[] = variant === 'overview' ? ['classic', 'ultimate', 'online'] : [variant];
    const isOverview = variant === 'overview';

    return (
        <section className="shadow-floating-sm bg-gradient-secondary-to-tertiary w-full max-w-4xl rounded-2xl border p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-highlight font-alegreya text-2xl font-semibold tracking-wide">How to Play</h2>
                <span className="text-text-secondary text-xs tracking-[0.2em] uppercase">Rules</span>
            </div>

            <div className={cn(isOverview ? 'grid gap-4 md:grid-cols-3' : 'space-y-4')}>
                {ruleKeys.map((key) => {
                    const ruleSet = RULE_SETS[key];
                    return (
                        <article key={key} className="bg-primary/60 rounded-xl border p-4">
                            <h3 className="text-text-primary text-lg font-semibold tracking-wide">{ruleSet.title}</h3>
                            <p className="text-text-secondary mb-3 text-sm">{ruleSet.subtitle}</p>
                            <ul className="text-text-secondary list-disc space-y-2 pl-5 text-sm">
                                {ruleSet.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default TicTacToeRules;
