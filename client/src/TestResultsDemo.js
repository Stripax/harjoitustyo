import React from 'react';
import { Bar, Radar } from 'react-chartjs-2';

const TestResultsDemo = () => {
    
    const data = {
        labels: ['Javascript perusteet', 'C# perusteet', 'HTML&CSS perusteet'],
        datasets: [ {
            label: 'Oikein',
            backgroundColor: 'rgb(0,255,0,0.2)',
            borderColor: 'rgba(0,255,0,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(0,255,0,0.45)',
            hoverBorderColor: 'rgba(0,255,0,0.2)',
            data: [12, 28, 47]
            }, {
            label: 'Väärin',
            backgroundColor: 'rgb(220,20,60,0.2)',
            borderColor: 'rgba(220,20,60,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(220,20,60,0.45)',
            hoverBorderColor: 'rgba(220,20,60,0.2)',
            data: [38, 22, 3]
            } ]
    };

    return (
        <div>
            <section style = {{backgroundColor: "white"}}>
                <h2>Tulosten esityksen mallit - Pylväsmalli</h2>
                <Bar
                    data={data}
                    width={100}
                    height={50}
                    options={{
                        scales: {
                            xAxes: [{
                                stacked: true
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                        }
                    }}
                />
            </section>

            <section style = {{backgroundColor: "whitesmoke"}}>
                <h2>Tulosten esityksen mallit - Tutkamalli</h2>
                <Radar data = {data} />
            </section>
        </div>
    );
}

export default TestResultsDemo