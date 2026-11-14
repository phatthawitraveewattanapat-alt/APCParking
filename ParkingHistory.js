import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedId, setSelectedId] = useState('A');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ไม่ว่าง');
  const [amount, setAmount] = useState('1');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [history, setHistory] = useState([
    { id: 1, spot: 'A', date: '2025-10-01 10:00', duration: '2 ชม.', amount: 40 },
    { id: 2, spot: 'B', date: '2025-10-05 14:30', duration: '1 ชม.', amount: 20 },
    { id: 3, spot: 'C', date: '2025-10-10 09:15', duration: '3 ชม.', amount: 60 },
  ]);

  const Home = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>APC Parking</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>เลือกช่องจอดรถ</Text>
        <View style={styles.parkingGrid}>
          {['A', 'B', 'C', 'D'].map((spot) => (
            <TouchableOpacity
              key={spot}
              style={[styles.spot, selectedId === spot && styles.spotSelected]}
              onPress={() => setSelectedId(spot)}
            >
              <Text style={[styles.spotText, selectedId === spot && styles.spotTextSelected]}>{spot}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>สถานะ: {status}</Text>
        <Text style={styles.label}>จำนวนชั่วโมง</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="จำนวนชั่วโมง"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setMessage(`จองช่องจอด ${selectedId} สำเร็จ จำนวน ${amount} ชม.`);
            Alert.alert('สำเร็จ', `จองช่องจอด ${selectedId} สำเร็จ จำนวน ${amount} ชม.`);
          }}
        >
          <Text style={styles.buttonText}>จองที่จอด</Text>
        </TouchableOpacity>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </ScrollView>
    </View>
  );

  const History = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ประวัติการจอดรถ</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>ยังไม่มีประวัติการจอดรถ</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <Text style={styles.historyLabel}>ช่องจอด</Text>
                <Text style={styles.historyValue}>{item.spot}</Text>
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyLabel}>วันที่</Text>
                <Text style={styles.historyValue}>{item.date}</Text>
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyLabel}>ระยะเวลา</Text>
                <Text style={styles.historyValue}>{item.duration}</Text>
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyLabel}>จำนวนเงิน</Text>
                <Text style={styles.historyValue}>{item.amount} บาท</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const Profile = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>โปรไฟล์</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>อีเมล</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="อีเมล" />
        <Text style={styles.label}>รหัสผ่าน</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="รหัสผ่าน" secureTextEntry />
        <Text style={styles.label}>ชื่อ-นามสกุล</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="ชื่อ-นามสกุล" />
        <Text style={styles.label}>เบอร์โทรศัพท์</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="เบอร์โทรศัพท์" keyboardType="phone-pad" />
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('บันทึก', 'บันทึกข้อมูลสำเร็จ')}>
          <Text style={styles.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const Settings = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ตั้งค่า</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>การแจ้งเตือน</Text>
          <TouchableOpacity onPress={() => setNotifications(!notifications)}>
            <Text style={styles.settingValue}>{notifications ? 'เปิด' : 'ปิด'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.app}>
      {page === 'home' && <Home />}
      {page === 'ประวัติการจอดรถ' && <History />}
      {page === 'profile' && <Profile />}
      {page === 'settings' && <Settings />}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => setPage('home')}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabLabel}>หน้าแรก</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setPage('ประวัติการจอดรถ')}>
          <Text style={styles.tabIcon}>📋</Text>
          <Text style={styles.tabLabel}>ประวัติ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setPage('profile')}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabLabel}>โปรไฟล์</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setPage('settings')}>
          <Text style={styles.tabIcon}>⚙️</Text>
          <Text style={styles.tabLabel}>ตั้งค่า</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2f6fed',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  parkingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  spot: {
    width: 70,
    height: 70,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  spotSelected: {
    backgroundColor: '#2f6fed',
    borderColor: '#1e4db7',
  },
  spotText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  spotTextSelected: {
    color: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2f6fed',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: 8,
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  historyLabel: {
    color: '#666',
    fontSize: 14,
  },
  historyValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
    fontSize: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#2f6fed',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 3,
  },
});
