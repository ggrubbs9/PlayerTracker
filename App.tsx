/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';

export interface IPlayerStats {
  name: string;
  message: string;
}

const HelloWorldApp = () => {
  const [players] = useState([
    {name: 'Auston Matthews', id: '8479318'},
    {name: 'Artemi Panarin', id: '8478550'},
    {name: 'Aleksander Barkov', id: '8477493'},
    {name: 'Jake Guentzel', id: '8477404'},
    {name: 'Anze Kopitar', id: '8471685'},
    {name: "Ryan O'Reilly", id: '8475158'},
    {name: 'Johnny Gaudreau', id: '8476346'},
    {name: 'Teuvo Teravainen', id: '8476882'},
    {name: 'Ryan Strome', id: '8476458'},
    {name: 'Ryan Nugent-Hopkins', id: '8476454'},
    {name: 'Jordan Eberle', id: '8474586'},
    {name: 'Conor Garland', id: '8478856'},
  ]);
  const [defensePlayers] = useState([
    {name: 'Tyson Barrie', id: '8475197'},
    {name: 'Kris Letang', id: '8471724'},
    {name: 'Torey Krug', id: '8476792'},
    {name: 'Adam Fox', id: '8479323'},
    {name: 'Thomas Chabot', id: '8478469'},
    {name: 'Erik Karlsson', id: '8474578'},
    {name: 'Adam Boqvist', id: '8480871'},
  ]);

  // const [powerPlay] = useState([
  //   {name: 'Carolina', id: '8476459'},
  //   {name: 'Pittsburgh', id: '8476459'},
  // ]);

  // const [shortHand] = useState([
  //   {name: 'Anaheim', id: '8476459'},
  //   {name: 'Edmonton', id: '8476459'},
  // ]);

  // const [goalies] = useState([
  //   {name: 'New York Rangers', id: '8476459'},
  //   {name: 'Seattle Kracken', id: '8476459'},
  //   {name: 'Calgary Flames', id: '8476459'},
  // ]);

  const baseUrl = 'https://statsapi.web.nhl.com/api/v1/';
  // const playerUrl = `${baseUrl}/people/${id}/stats`;

  const getPlayerStats = async () => {
    setRows([]);
    const promises: any[] = [];

    const getData = async (x: string) => {
      const res = axios.get(
        `https://statsapi.web.nhl.com/api/v1/people/${x}/stats?stats=statsSingleSeason&season=20212022`,
      );
      console.log(res);
      return res;
    };

    players.forEach(element => {
      promises.push(getData(element.id));
    });

    await Promise.all(promises).then(results => {
      results.map((item, i) => {
        setRows(rows => [
          ...rows,
          [
            players[i].name,
            item.data.stats[0].splits[0].stat.goals,
            item.data.stats[0].splits[0].stat.assists,
            item.data.stats[0].splits[0].stat.points,
            createFantasyPoints(item.data.stats[0].splits[0].stat),
          ],
        ]);
        sortArray();
      });
    });
  };

  function sortArray() {
    const sortedData = rows.sort((a, b) => b[4] - a[4]);
    console.log(sortedData);
    setRows(sortedData);
  }

  function createFantasyPoints(stats: any) {
    const fantasyPoints =
      stats.goals * 2 + stats.assists + stats.plusMinus * 0.5;
    return fantasyPoints;
  }

  const [rows, setRows] = useState<any[]>([]);
  const [defenseRows, setDefenseRows] = useState([]);
  const [games, setGames] = useState(1);
  const [tableHead] = useState([
    'Name',
    'Goals',
    'Assists',
    'asdf',
    'Fantasy Points',
  ]);

  useEffect(() => {
    getPlayerStats();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // console.log(rows);
  }, [rows]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>Offense Players</Text>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={rows} textStyle={styles.text} />
        </Table>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6},
});

export default HelloWorldApp;
