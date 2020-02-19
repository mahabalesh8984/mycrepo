import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  options: Object;
  options3D: Object;
  optionsStack: object;
  pie3D: object;
  areaspline: object;
  donutChart: object;
  columnNull: object;
  variablePie: object;
  constructor () {
  this.options = {
    chart: {
        type: 'line',
         options3d: {
            enabled: true,
            alpha: 15,
            beta: 15,
            depth: 50
        }
    },
    plotOptions: {
        column: {
            depth: 25
        }
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
};



  this.options3D = {
    chart: {
        type: 'column',
         options3d: {
            enabled: true,
            alpha: 15,
            beta: 15,
            depth: 50
        }
    },
    title: {
        text: ''
    },
    plotOptions: {
        column: {
            depth: 25
        }
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
};
this.optionsStack = {
  chart: {
    type: 'column',
      options3d: {
enabled: true,
        alpha: 15,
        beta: 15,
        depth: 110
    }
},
title: {
    text: ''
},
plotOptions: {
    column: {
        depth: 40,
        stacking: true,
        grouping: false,
        groupZPadding: 10
    }
},
series: [{
    data: [1, 2, 4, 3, 2, 4],
    stack: 0
}, {
    data: [5, 6, 3, 4, 1, 2],
    stack: 0
}, {
    data: [7, 9, 8, 7, 5, 8],
    stack: 1
}]
};

this.pie3D = {
    chart: {
         type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0,
        },
        spacingTop:0
    },
    
    exporting:false,
    title: {
        text: '',
        style:{
            display:'none'
        }
    },
    plotOptions: {
        pie: {
            depth: 25
        }
    },
    series: [{
        data: [2, 4, 6, 1, 3]
    }]
};

this.areaspline = {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: ''
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 150,
        y: 100,
        floating: true,
        borderWidth: 1,
    },
    xAxis: {
        categories: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ]
    },
    yAxis: {
        title: {
            text: 'Fruit units'
        }
    },
    tooltip: {
        shared: true,
        valueSuffix: ' units'
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        areaspline: {
            fillOpacity: 0.6
        },
        series: {
            lineWidth: 0
        }
    },
    colors: ['#7e81cb', '#fb9678', '#01c0c8'],
    series: [{
        name: 'John',
        data: [3, 4, 3, 5, 4, 8, 10]
    }, {
        name: 'Jane',
        data: [1, 3, 4, 3, 3, 5, 4]
    }, {
        name: 'Sandeep',
        data: [1, 1, 6, 8, 6, 2, 1]
    }]
};


this.donutChart = {
    chart: {
         type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45
        }
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45
        }
    },
    series: [{
        name: 'Delivered amount',
        data: [
            ['Bananas', 8],
            ['Kiwi', 3],
            ['Mixed nuts', 1],
            ['Oranges', 6],
            ['Apples', 8],
            ['Pears', 4],
            ['Clementines', 4],
            ['Reddish (bag)', 1],
            ['Grapes (bunch)', 1]
        ]
    }]
};


this.columnNull = {
    chart: {
         type: 'column',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 25,
            depth: 70
        }
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    plotOptions: {
        column: {
            depth: 25
        }
    },
    xAxis: {
         labels: {
            skew3d: true,
            style: {
                fontSize: '16px'
            }
        }
    },
    yAxis: {
        title: {
            text: null
        }
    },
    series: [{
        name: 'Sales',
        data: [2, 3, null, 4, 0, 5, 1, 4, 6, 3]
    }]
};


 

  }
  ngOnInit() {
      debugger
     // alert('hi');
    //  $(document).ready(() => {
    //     const trees: any = $('[data-widget="tree"]');
    //     trees.tree();
    //   });
    
  }
  

  ngAfterViewInit() {
    //location.reload();
    var cnt= localStorage.getItem('ldcnt');
   if (cnt=='1')
   {
    localStorage.setItem('ldcnt','2');
    window.location.reload();
   }

  }
}
