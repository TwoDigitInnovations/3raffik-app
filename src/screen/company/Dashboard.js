import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import Svg, {Circle} from 'react-native-svg';
import {User, Bell, Store, Users, Megaphone, DollarSign} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
 
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 65],
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#FFCC0024',
    backgroundGradientFrom: '#FFCC0024',
    backgroundGradientTo: '#FFCC0024',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(239, 0, 39, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
    },
    propsForBackgroundLines: {
      strokeWidth: 0,
    },
  };

 
  const DonutChart = () => {
    const size = 140;
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    
    
    const totalProducts = 150;
    const topSell = 50;
    const total = totalProducts + topSell;
    const yellowPercentage = (totalProducts / total) * 100;
    const redPercentage = (topSell / total) * 100;
    
    const yellowStrokeDasharray = `${(yellowPercentage / 100) * circumference} ${circumference}`;
    const redStrokeDasharray = `${(redPercentage / 100) * circumference} ${circumference}`;
    const redStrokeDashoffset = -((yellowPercentage / 100) * circumference);

    return (
      <View style={styles.donutContainer}>
        <Svg width={size} height={size}>
         
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FFCC00"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={yellowStrokeDasharray}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
      
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EF0027"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={redStrokeDasharray}
            strokeDashoffset={redStrokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.donutCenter}>
          <Text style={styles.donutCenterValue}>150</Text>
          <Text style={styles.donutCenterLabel}>Products</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <User size={28} color="#666" />
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.notificationContainer}>
            <Bell size={28} color="#666" />
            <View style={styles.notificationDot} />
          </View>
        </View>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello, Harry!</Text>
          <Text style={styles.subGreetingText}>Good evening what are you up to?</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.earningsCard]}>
            <Store size={24} color="#EF0027" />
            <Text style={styles.statValue}>$1,200.75</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>
          
          <View style={[styles.statCard, styles.clicksCard]}>
            <Users size={24} color="#EF0027" />
            <Text style={styles.statValue}>475</Text>
            <Text style={styles.statLabel}>Clicks</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.marketingCard]}>
            <Megaphone size={24} color="#EF0027" />
            <Text style={styles.statValue}>175</Text>
            <Text style={styles.statLabel}>Marketing</Text>
          </View>
          
          <View style={[styles.statCard, styles.revenueCard]}>
            <DollarSign size={24} color="#EF0027" />
            <Text style={styles.statValue}>35</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>Affiliate Marketing</Text>
            <Text style={styles.chartSubtitle}>Last 30 Days</Text>
          </View>
          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              width={screenWidth - 80}
              height={160}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 16,
              }}
              withHorizontalLabels={false}
              withVerticalLabels={false}
              withDots={false}
              withShadow={false}
              withScrollableDot={false}
            />
          </View>
        </View>

        <View style={styles.pieChartContainer}>
          <Text style={styles.chartTitle}>Top Selling Product</Text>
          <View style={styles.pieChartMainWrapper}>
            <DonutChart />
            
            <View style={styles.legendRightContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, {backgroundColor: '#FFCC00'}]} />
                <Text style={styles.legendText}>Total Product</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, {backgroundColor: '#EF0027'}]} />
                <Text style={styles.legendText}>Top Sell</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF0027',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  greetingContainer: {
    marginTop: 0,
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subGreetingText: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.1,
    // borderColor: '#F3F4F6',
boxShadow: '0px 1px 3px rgba(156, 163, 175, 0.15)'
  },
  earningsCard: {
    backgroundColor: '#FFCC0024',
  },
  clicksCard: {
    backgroundColor: '#EF00271F',
  },
  marketingCard: {
    backgroundColor: '#EF00271F',
  },
  revenueCard: {
    backgroundColor: '#FFCC0024',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
    marginBottom: 5,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFCC0024',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    borderWidth: 0.1,
    // borderColor: '#F3F4F6',
boxShadow: '0px 1px 3px rgba(156, 163, 175, 0.15)'
  },
  chartTitleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  chartWrapper: {
    // position: 'relative',
    // backgroundColor: '#FFCC0024',
    // borderRadius: 16,
    // overflow: 'hidden',
  },
  chartOverlay: {
    position: 'absolute',
    top: 15,
    left: 20,
  },
  chartOverlayText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  chartBackground: {
    backgroundColor: '#FFCC00',
    borderRadius: 16,
    overflow: 'hidden',
  },
  customChart: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartContainer: {
    backgroundColor: '#FFCC0024',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    marginBottom: 70,
   borderWidth: 0.1,
    // borderColor: '#F3F4F6',
boxShadow: '0px 1px 3px rgba(156, 163, 175, 0.15)'
  },
  pieChartMainWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  donutContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  donutCenterLabel: {
    fontSize: 12,
    color: '#666',
  },
  pieChartLeftSection: {
    position: 'relative',
    alignItems: 'center',
  },
  pieChartWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  pieChartCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -30}, {translateY: -25}],
    alignItems: 'center',
  },
  pieChartCenterValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pieChartCenterLabel: {
    fontSize: 12,
    color: '#666',
  },
  legendRightContainer: {
    flex: 1,
    paddingLeft: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});