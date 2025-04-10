import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#F7931E', '#4A90E2', '#C1272D'];

const MoodPie = ({ mood, stress, tonus }) => {
    // On transforme les props en nombre
    mood = parseInt(mood, 10);
    stress = parseInt(stress, 10);
    tonus = parseInt(tonus, 10);

    const data = [
        { name: 'Mood', value: mood },
        { name: 'Stress', value: stress },
        { name: 'Tonus', value: tonus },
    ];

    return (
        <div className='flex flex-row justify-center items-center w-50 sm:w-1/2'>
            <PieChart width={300} height={220}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                {/* <Tooltip />
                <Legend 
                    payload={data.map((entry, index) => ({
                        value: entry.name, 
                        type: 'square', 
                        color: COLORS[index % COLORS.length]
                    }))}
                /> */}
            </PieChart>
        </div>
    );
}

export default MoodPie;
