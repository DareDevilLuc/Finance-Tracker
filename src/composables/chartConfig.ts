import {
    Chart as ChartJs,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'


ChartJs.register(
    ArcElement,
    Tooltip,
    Legend
)

export const chartData = {
    labels: ['Food', 'Rent', 'Transportation'],
    datasets: [
        {
            data: [3000, 12000, 2500],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ]
        }
    ],
}