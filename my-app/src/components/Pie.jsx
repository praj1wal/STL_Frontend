import React, { useState } from 'react';
import {PieChart, Pie, Sector, ResponsiveContainer, Cell} from 'recharts';

const COLORS1 = ['#5893d8', '#53bbc9', '#5fd4a8', '#8ee677', '#dcf483', '#eedc9b', '#0d47a1', '#90caf9'];
const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,name } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius+15}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 21}
        outerRadius={outerRadius + 25}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" style={{fontSize:10}}>{`Capacity ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`Lab ${name}`}
      </text>
    </g>
  );
};

function TwoLevelPieChart(props){
    const [activeIndex, setIndex] = useState(null);
    
    const onPieEnter = (data, index) =>{
        setIndex(index)
    }
    
    const onPieExit = (data, index) =>{
       setIndex(null)
    }
 
    return (
      <div style={{ width: '100%', height: 300}}>
        <ResponsiveContainer>
          <PieChart >
            <Pie 
              activeIndex={activeIndex}
              activeShape={renderActiveShape} 
              data={props.data} 
              outerRadius={80}
              fill="#ff5533"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieExit}>
                {
                props.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />)
                }
            </Pie>
            </PieChart>
        </ResponsiveContainer>
       </div>
    );
}

export default TwoLevelPieChart;