import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import map from 'lodash/map';
import isEqual from 'lodash/isEqual';

import { Responsive, WidthProvider } from 'react-grid-layout';
import { Toolbar, Button } from '@material-ui/core';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import LineChart from './Graphs/LineChart';
import PieChart from './Graphs/PieChart';
import BarChart from './Graphs/BarChart';

import { handleShowGraphFormDialog, handleAddGraph, initGraphs, handleUpdateGraph } from '../../store/actions/graphActions';

import { GridStyles } from './DashboardStyles';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


class GridLayout extends React.Component {
  static defaultProps = {
    className: 'layout',
    rowHeight: 30,
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    initialLayout: []
  };

  state = {
    currentBreakpoint: 'lg',
    compactType: 'vertical',
    mounted: false,
    layouts: { lg: this.props.initialLayout }
  };

  componentWillMount() {
    this.props.initGraphs();
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.graphs.length, nextProps.graphs.length)) {
      const newState = this.state.layouts[this.state.currentBreakpoint];
      const diff = nextProps.graphs.length - this.props.graphs.length;
      nextProps.graphs.slice(nextProps.graphs.length - diff).forEach((g) => {
        const x = parseInt(g.x, 10);
        const y = parseInt(g.y, 10);
        newState.push({
          x,
          y: y > -1 ? y : Infinity,
          h: parseInt(g.height, 10),
          w: parseInt(g.width, 10),
          minH: 4
        });
      });
      this.setState({
        layouts: {
          ...this.state.layouts,
          [this.state.currentBreakpoint]: newState
        }
      })
    } else if (this.props.editingChart && !nextProps.editingChart) {
      
      const p = nextProps.graphs[this.props.editingChart.index];
      this.updateLayout(p, this.props.editingChart.index)
    }
  }

  updateLayout(config, index) {
    const newState = this.state.layouts[this.state.currentBreakpoint];
    const currentLayout = newState[index];
    const x = parseInt(config.x, 10);
    const y = parseInt(config.y, 10);
    this.setState({
      layouts: {
        ...this.state.layouts,
        [this.state.currentBreakpoint]: [
          ...newState.slice(0, index),
          {
            ...currentLayout,
            x,
            y: y > -1 ? y : Infinity,
            h: parseInt(config.height, 10),
            w: parseInt(config.width, 10),
          },
          ...newState.slice(index + 1),
        ]
      }
    })
  }

  handleUpdateLayoutAndGraph = (layoutItem) => {
    const index = parseInt(layoutItem.i, 10);
    const currentChart = this.props.graphs[index];
    this.props.handleUpdateGraph({
      ...currentChart,
      height: layoutItem.h,
      width: layoutItem.w,
      x: layoutItem.x,
      y: layoutItem.y,
      index
    });
    this.updateLayout(currentChart, index);
  }

  onBreakpointChange = breakpoint => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  onLayoutChange = (layout, layouts) => {
    layout.forEach(l => this.handleUpdateLayoutAndGraph(l))
    this.setState({ layouts });
  }

  generateDOM = () => {
    const { classes } = this.props;
    return map(this.state.layouts[this.state.currentBreakpoint] || this.state.layouts.lg, (l, i) => {
      const config = { ...this.props.graphs[i], index: i };
      const props = {
        height: config.height * this.props.rowHeight,
        width: config.width,
        config: config,
        onEdit: () => {
          this.props.globalEventDistributor.dispatch(
            handleShowGraphFormDialog(true, config, this.props.handleUpdateGraph)
          );
        }
      };
      return (
        <div key={i} className={classes.gridItem} data-grid={l}>
          {isEqual(config.chartType, 'line') && 
            <LineChart {...props} />
          }
          {isEqual(config.chartType, 'pie') && 
            <PieChart {...props} />
          }
          {isEqual(config.chartType, 'bar') && 
            <BarChart {...props} />
          }
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <Toolbar>
          <Button
            color="primary"
            variant="raised"
            onClick={() => {
              this.props.globalEventDistributor.dispatch(
                handleShowGraphFormDialog(true, null, this.props.handleAddGraph)
              );
            }}
          >
            Create a new Graph
          </Button>
        </Toolbar>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          measureBeforeMount={false}
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
          isDraggable={true}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  graphs: state.graphs.graphs,
  editingChart: state.graphs.formState.editing
});

export default connect(mapStateToProps, { handleAddGraph, initGraphs, handleUpdateGraph })(
  withStyles(GridStyles)(GridLayout)
);
