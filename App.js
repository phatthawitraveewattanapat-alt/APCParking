import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';

const BLUE = '#087DBB';
const BG = '#F2F7FB';
const GREEN = '#169B70';
const RED = '#E84D5B';
const ORANGE = '#F59E0B';
const GRAY = '#718492';

const INITIAL_DATA = [
  { id: 'A', name: 'ลานจอดรถ A', location: 'อาคารเรียนรวม', total: 60, used: 18 },
  { id: 'B', name: 'ลานจอดรถ B', location: 'อาคารกิจกรรมนักศึกษา', total: 50, used: 38 },
  { id: 'C', name: 'ลานจอดรถ C', location: 'อาคารหอสมุด', total: 40, used: 40 },
  { id: 'D', name: 'ลานจอดรถ D', location: 'อาคารนวัตกรรม', total: 80, used: 28 },
];

const TABS = [
  { name: 'home', label: 'หน้าหลัก', icon: '🏠' },
  { name: 'map', label: 'แผนที่', icon: '🗺️' },
  { name: 'list', label: 'ที่จอดรถ', icon: '🅿️' },
  { name: 'notifications', label: 'แจ้งเตือน', icon: '🔔' },
  { name: 'profile', label: 'โปรไฟล์', icon: '👤' },
];

const TITLES = {
  home: 'APC Parking',
  map: 'แผนที่ที่จอดรถ',
  list: 'รายการที่จอดรถ',
  notifications: 'แจ้งเตือน',
  profile: 'โปรไฟล์',
  settings: 'ตั้งค่า',
  detail: 'รายละเอียด',
  update: 'อัปเดตสถานะ',
  history: 'ประวัติการจอดรถ',
};

const freeOf = (p) => p.total - p.used;

function Field({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#8394A5"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  );
}

function ActionButton({ title, onPress, color = BLUE, outline = false }) {
  return (
    <TouchableOpacity
      style={[styles.button, outline ? styles.outlineButton : { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, outline && styles.outlineText]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [page, setPage] = useState('login');
  const [parking, setParking] = useState(INITIAL_DATA);
  const [selectedId, setSelectedId] = useState('A');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ไม่ว่าง');
  const [amount, setAmount] = useState('1');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notifications, setNotifications] = useState([
    {
      title: 'ยินดีต้อนรับสู่ APC Parking',
      detail: 'เริ่มค้นหาที่จอดรถได้เลย',
    },
  ]);
  const [history, setHistory] = useState([
    { id: 1, spot: 'A', date: '2025-10-01 10:00', duration: '2 ชม.', amount: 40 },
    { id: 2, spot: 'B', date: '2025-10-05 14:30', duration: '1 ชม.', amount: 20 },
    { id: 3, spot: 'C', date: '2025-10-10 09:15', duration: '3 ชม.', amount: 60 },
  ]);

  const selected = parking.find((p) => p.id === selectedId) || parking[0];
  const filtered = parking.filter((p) =>
    (p.name + p.location).toLowerCase().includes(search.trim().toLowerCase())
  );

  function openDetail(id) {
    setSelectedId(id);
    setMessage('');
    setPage('detail');
  }

  function go(tab) {
    setMessage('');
    setPage(tab);
  }

  function login() {
    if (!email.trim() || !password.trim()) {
      setMessage('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    setMessage('');
    setPage('home');
  }

  function register() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage('กรุณากรอกชื่อ อีเมล และรหัสผ่าน');
      return;
    }
    setMessage('');
    setPage('home');
  }

  function logout() {
    setMessage('');
    setPassword('');
    setPage('login');
  }

  function updateStatus() {
    const count = Number(amount);

    if (!Number.isInteger(count) || count < 1) {
      setMessage('กรุณากรอกจำนวนช่องเป็นเลขจำนวนเต็มตั้งแต่ 1 ขึ้นไป');
      return;
    }

    const current = parking.find((p) => p.id === selectedId);
    if (!current) return;

    let changed = 0;
    let newUsed = current.used;

    if (status === 'ว่าง') {
      changed = Math.min(count, current.used);
      newUsed = current.used - changed;
    } else if (status === 'ไม่ว่าง') {
      changed = Math.min(count, current.total - current.used);
      newUsed = current.used + changed;
    } else {
      changed = current.total - current.used;
      newUsed = current.total;
    }

    if (status !== 'เต็ม' && changed === 0) {
      setMessage(
        status === 'ว่าง'
          ? 'ไม่มีช่องที่กำลังใช้งานให้เปลี่ยนเป็นว่าง'
          : 'ไม่มีช่องว่างเหลือให้เปลี่ยนเป็นไม่ว่าง'
      );
      return;
    }

    setParking((old) =>
      old.map((p) => (p.id === selectedId ? { ...p, used: newUsed } : p))
    );

    setNotifications((old) => [
      {
        title: 'อัปเดต ' + current.name,
        detail: 'สถานะ ' + status + ' จำนวน ' + changed + ' ช่อง',
      },
      ...old,
    ]);

    setMessage('อัปเดตสถานะเรียบร้อย');
    setPage('list');
  }

  function card(p) {
    const available = freeOf(p);
    const percent = p.total > 0 ? (p.used / p.total) * 100 : 0;

    return (
      <TouchableOpacity
        key={p.id}
        style={styles.card}
        onPress={() => openDetail(p.id)}
        activeOpacity={0.8}
      >
        <View style={styles.row}>
          <Text style={styles.parkingIcon}>🅿️</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{p.name}</Text>
            <Text style={styles.muted}>{p.location}</Text>
          </View>

          <Text style={{ color: BLUE, fontSize: 25 }}>›</Text>
        </View>

        <View style={[styles.row, { marginTop: 14 }]}>
          <Text style={{ color: available === 0 ? RED : GREEN, fontWeight: 'bold' }}>
            {available === 0 ? 'เต็มแล้ว' : 'ว่าง ' + available + ' ช่อง'}
          </Text>

          <Text style={styles.muted}>
            ใช้งาน {p.used}/{p.total}
          </Text>
        </View>

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progress,
              {
                width: `${percent}%`,
                backgroundColor:
                  available === 0 ? RED : percent >= 75 ? ORANGE : GREEN,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  }

  function mapView() {
    const pins = [
      { id: 'A', left: '10%', top: '12%' },
      { id: 'B', left: '70%', top: '15%' },
      { id: 'C', left: '42%', top: '48%' },
      { id: 'D', left: '72%', top: '72%' },
    ];

    return (
      <View style={styles.map}>
        <View style={[styles.road, { top: 55 }]} />
        <View style={[styles.road, { top: 145 }]} />
        <View style={[styles.roadVertical, { left: '28%' }]} />
        <View style={[styles.roadVertical, { left: '67%' }]} />

        {pins.map((pin) => {
          const spot = parking.find((p) => p.id === pin.id);

          return (
            <TouchableOpacity
              key={pin.id}
              onPress={() => openDetail(pin.id)}
              style={[
                styles.pin,
                {
                  left: pin.left,
                  top: pin.top,
                  backgroundColor: spot && freeOf(spot) > 0 ? GREEN : RED,
                },
              ]}
            >
              <Text style={styles.pinText}>P{pin.id}</Text>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.mapCaption}>แผนที่จำลอง · แตะ P เพื่อดูรายละเอียด</Text>
      </View>
    );
  }

  function loginScreen() {
    return (
      <ScrollView contentContainerStyle={styles.authPage} keyboardShouldPersistTaps="handled">
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🅿️ APC</Text>
          <Text style={styles.logoOrange}>Parking</Text>
          <Text style={styles.muted}>เช็กที่จอดรถในมหาวิทยาลัย</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.authHeading}>เข้าสู่ระบบ</Text>
          <Text style={styles.muted}>ยินดีต้อนรับกลับมา!</Text>

          <Field placeholder="อีเมล หรือเบอร์โทรศัพท์" value={email} onChangeText={setEmail} />
          <Field
            placeholder="รหัสผ่าน"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.forgot}
            onPress={() => setMessage('ลืมรหัสผ่าน: กรุณาติดต่อเจ้าหน้าที่อาคาร')}
          >
            <Text style={styles.link}>ลืมรหัสผ่าน?</Text>
          </TouchableOpacity>

          {!!message && <Text style={styles.message}>{message}</Text>}

          <ActionButton title="เข้าสู่ระบบ" onPress={login} />

          <Text style={styles.centerText}>ยังไม่มีบัญชีใช่ไหม?</Text>
          <ActionButton
            title="สมัครสมาชิก"
            outline
            onPress={() => {
              setMessage('');
              setPage('register');
            }}
          />
        </View>
      </ScrollView>
    );
  }

  function registerScreen() {
    return (
      <ScrollView contentContainerStyle={styles.authPage} keyboardShouldPersistTaps="handled">
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🅿️ APC</Text>
          <Text style={styles.logoOrange}>Parking</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.authHeading}>สมัครสมาชิก</Text>
          <Text style={styles.muted}>สร้างบัญชีเพื่อใช้งาน APC Parking</Text>

          <Field placeholder="ชื่อ-นามสกุล" value={name} onChangeText={setName} />
          <Field
            placeholder="เบอร์โทรศัพท์"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Field placeholder="อีเมล" value={email} onChangeText={setEmail} />
          <Field
            placeholder="ตั้งรหัสผ่าน"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!!message && <Text style={styles.message}>{message}</Text>}

          <ActionButton title="ลงทะเบียน" onPress={register} />

          <View style={styles.switchRow}>
            <Text style={styles.muted}>มีบัญชีอยู่แล้ว? </Text>
            <TouchableOpacity onPress={() => { setMessage(''); setPage('login'); }}>
              <Text style={styles.link}>เข้าสู่ระบบ</Text>
            </TouchableOpacity>
          </View>

          <ActionButton
            title="กลับไปหน้าเข้าสู่ระบบ"
            outline
            onPress={() => { setMessage(''); setPage('login'); }}
          />
        </View>
      </ScrollView>
    );
  }

  function home() {
    const totalFree = parking.reduce((sum, p) => sum + freeOf(p), 0);
    const totalUsed = parking.reduce((sum, p) => sum + p.used, 0);

    return (
      <>
        <View style={styles.hero}>
          <Text style={styles.heroSmall}>SMART CAMPUS</Text>
          <Text style={styles.heroTitle}>APC Parking 🚗</Text>
          <Text style={styles.heroSub}>ค้นหาที่จอดรถได้ง่าย ๆ</Text>

          <TextInput
            style={styles.search}
            placeholder="ค้นหาลานจอดรถหรืออาคาร..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#7D93A2"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>ภาพรวมที่จอดรถ</Text>

          <View style={styles.row}>
            <View style={styles.summary}>
              <Text style={styles.summaryNumber}>{totalFree}</Text>
              <Text style={styles.muted}>ช่องว่าง</Text>
            </View>

            <View style={styles.summary}>
              <Text style={styles.summaryNumber}>{totalUsed}</Text>
              <Text style={styles.muted}>ใช้งานแล้ว</Text>
            </View>

            <View style={[styles.summary, { marginRight: 0 }]}>
              <Text style={styles.summaryNumber}>{parking.length}</Text>
              <Text style={styles.muted}>ลานจอดรถ</Text>
            </View>
          </View>

          <Text style={[styles.heading, { marginTop: 22 }]}>แผนที่ที่จอดรถ</Text>

          {mapView()}

          <View style={styles.row}>
            <Text style={styles.heading}>ลานจอดรถ</Text>

            <TouchableOpacity onPress={() => go('list')}>
              <Text style={styles.link}>ดูทั้งหมด ›</Text>
            </TouchableOpacity>
          </View>

          {filtered.map((p) => card(p))}

          {filtered.length === 0 && (
            <Text style={styles.muted}>ไม่พบลานจอดรถที่ค้นหา</Text>
          )}
        </View>
      </>
    );
  }

  function parkingList() {
    return (
      <View style={styles.section}>
        <Text style={styles.pageTitle}>รายการที่จอดรถ</Text>

        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="ค้นหาลานจอดรถหรืออาคาร..."
          placeholderTextColor="#7D93A2"
        />

        {filtered.map((p) => card(p))}

        {filtered.length === 0 && (
          <Text style={styles.muted}>ไม่พบลานจอดรถ</Text>
        )}
      </View>
    );
  }

  function mapPage() {
    return (
      <View style={styles.section}>
        <Text style={styles.pageTitle}>แผนที่ที่จอดรถ</Text>
        {mapView()}
        {parking.map((p) => card(p))}
      </View>
    );
  }

  function detail() {
    return (
      <View style={styles.section}>
        <Text style={styles.pageTitle}>{selected.name}</Text>
        <Text style={styles.muted}>{selected.location}</Text>

        {mapView()}

        <View style={styles.detailBox}>
          <Text style={styles.muted}>ช่องจอดรถว่าง</Text>
          <Text style={styles.bigNumber}>{freeOf(selected)}</Text>
          <Text style={styles.muted}>ทั้งหมด {selected.total} ช่อง</Text>
          <Text style={styles.muted}>ใช้งานแล้ว {selected.used} ช่อง</Text>
        </View>

        <ActionButton
          title="อัปเดตสถานะที่จอดรถ"
          color={ORANGE}
          onPress={() => {
            setMessage('');
            setPage('update');
          }}
        />

        <ActionButton title="กลับไปรายการที่จอดรถ" color={GRAY} onPress={() => go('list')} />
      </View>
    );
  }

  function updatePage() {
    return (
      <View style={styles.section}>
        <Text style={styles.pageTitle}>อัปเดตสถานะ</Text>
        <Text style={styles.muted}>เลือกลานจอดรถ</Text>

        {parking.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => setSelectedId(p.id)}
            style={[styles.card, selectedId === p.id && styles.selectedCard]}
          >
            <Text style={styles.cardTitle}>
              {selectedId === p.id ? '🔵 ' : '⚪ '}
              {p.name}
            </Text>
            <Text style={styles.muted}>ว่าง {freeOf(p)} ช่อง</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>สถานะที่ต้องการตั้ง</Text>

        {['ว่าง', 'ไม่ว่าง', 'เต็ม'].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setStatus(s)}
            style={[styles.option, status === s && styles.selectedCard]}
          >
            <Text style={styles.cardTitle}>
              {status === s ? '🔵 ' : '⚪ '}
              {s}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>จำนวนช่อง (ใช้กับสถานะว่าง/ไม่ว่าง)</Text>

        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={amount}
          onChangeText={setAmount}
          placeholder="จำนวนช่อง"
          placeholderTextColor="#7D93A2"
        />

        {!!message && <Text style={styles.message}>{message}</Text>}

        <ActionButton title="ยืนยันการอัปเดต" color={GREEN} onPress={updateStatus} />
        <ActionButton title="ยกเลิก" color={GRAY} onPress={() => go('detail')} />
      </View>
    );
  }

  function notificationPage() {
    return (
      <View style={styles.section}>
        <Text style={styles.pageTitle}>การแจ้งเตือน</Text>

        {notifications.map((n, i) => (
          <View key={`${n.title}-${i}`} style={styles.card}>
            <Text style={styles.cardTitle}>🔔 {n.title}</Text>
            <Text style={styles.muted}>{n.detail}</Text>
          </View>
        ))}
      </View>
    );
  }

  function profilePage() {
    return (
      <View style={styles.section}>
        <Text style={styles.pageTitle}>โปรไฟล์</Text>

        <View style={styles.detailBox}>
          <Text style={{ fontSize: 48 }}>👤</Text>
          <Text style={styles.cardTitle}>{name.trim() || 'ผู้ใช้งานทั่วไป'}</Text>
          <Text style={styles.muted}>{email.trim() || 'ยังไม่ได้เชื่อมต่อระบบบัญชี'}</Text>
          {!!phone.trim() && <Text style={styles.muted}>{phone}</Text>}
        </View>

        <ActionButton title="ประวัติการจอดรถ" onPress={() => go('history')} />
        <ActionButton title="ตั้งค่า" onPress={() => go('settings')} />
        <ActionButton title="ออกจากระบบ" color={RED} onPress={logout} />
      </View>
    );
  }

  function historyPage() {
    return (
      <View style={styles.section}>
        <Text style={styles.pageTitle}>ประวัติการจอดรถ</Text>

        {history.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>ช่องจอด {item.spot}</Text>
              <Text style={{ color: BLUE, fontWeight: 'bold' }}>{item.amount} บาท</Text>
            </View>
            <View style={[styles.row, { marginTop: 6 }]}>
              <Text style={styles.muted}>{item.date}</Text>
              <Text style={styles.muted}>{item.duration}</Text>
            </View>
          </View>
        ))}

        <ActionButton title="กลับไปหน้าโปรไฟล์" color={GRAY} onPress={() => go('profile')} />
      </View>
    );
  }

  function settingsPage() {
    return (
      <View style={styles.section}>
        <Text style={styles.pageTitle}>เกี่ยวกับแอป</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>APC Parking</Text>
          <Text style={styles.muted}>เวอร์ชัน 1.0.0</Text>
          <Text style={styles.muted}>ระบบต้นแบบสำหรับค้นหาที่จอดรถ</Text>
          <Text style={styles.muted}>ข้อมูลตัวอย่างใช้เพื่อการสาธิตเท่านั้น</Text>
        </View>

        <ActionButton title="กลับไปหน้าโปรไฟล์" color={GRAY} onPress={() => go('profile')} />
      </View>
    );
  }

  function renderPage() {
    switch (page) {
      case 'home':
        return home();
      case 'map':
        return mapPage();
      case 'list':
        return parkingList();
      case 'detail':
        return detail();
      case 'update':
        return updatePage();
      case 'notifications':
        return notificationPage();
      case 'profile':
        return profilePage();
      case 'settings':
        return settingsPage();
      case 'history':
        return historyPage();
      default:
        return home();
    }
  }

  if (page === 'login' || page === 'register') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        {page === 'login' ? loginScreen() : registerScreen()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={BLUE} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerLogo}>🅿️ APC</Text>

        <Text style={styles.headerTitle}>{TITLES[page] || 'APC Parking'}</Text>

        <TouchableOpacity onPress={() => go('notifications')}>
          <Text style={styles.headerBell}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        {renderPage()}
      </ScrollView>

      <View style={styles.bottomBar}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.name} style={styles.tab} onPress={() => go(t.name)}>
            <Text style={[styles.tabIcon, page === t.name && { color: BLUE }]}>{t.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                page === t.name && { color: BLUE, fontWeight: 'bold' },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  authPage: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 22,
  },

  logoBox: {
    alignItems: 'center',
    marginBottom: 25,
  },

  logo: {
    fontSize: 38,
    fontWeight: 'bold',
    color: BLUE,
  },

  logoOrange: {
    fontSize: 30,
    fontWeight: 'bold',
    color: ORANGE,
    marginBottom: 8,
  },

  authHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#164B70',
    marginBottom: 7,
  },

  header: {
    height: 57,
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  headerLogo: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12,
  },

  headerBell: {
    fontSize: 20,
  },

  hero: {
    backgroundColor: BLUE,
    padding: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  heroSmall: {
    color: '#C5EFFF',
    fontSize: 11,
    letterSpacing: 2,
  },

  heroTitle: {
    color: '#fff',
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 5,
  },

  heroSub: {
    color: '#E5F5FF',
    marginTop: 7,
    fontSize: 13,
  },

  search: {
    backgroundColor: '#fff',
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 13,
    marginTop: 18,
    color: '#263D4D',
  },

  section: {
    padding: 16,
  },

  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#20394C',
    marginBottom: 12,
  },

  pageTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: BLUE,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summary: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 10,
    alignItems: 'center',
    marginRight: 6,
  },

  summaryNumber: {
    color: BLUE,
    fontWeight: 'bold',
    fontSize: 23,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 11,
    borderWidth: 1,
    borderColor: '#E5EDF2',
  },

  selectedCard: {
    borderColor: BLUE,
    backgroundColor: '#EAF7FF',
  },

  parkingIcon: {
    fontSize: 28,
    marginRight: 12,
  },

  cardTitle: {
    color: '#263D4D',
    fontSize: 14,
    fontWeight: 'bold',
  },

  muted: {
    color: '#7B8E9C',
    fontSize: 12,
    marginTop: 5,
  },

  progressBg: {
    height: 7,
    backgroundColor: '#E6EDF1',
    borderRadius: 8,
    marginTop: 10,
    overflow: 'hidden',
  },

  progress: {
    height: 7,
    borderRadius: 8,
  },

  map: {
    height: 240,
    backgroundColor: '#E4F1E6',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#D1E5D5',
  },

  road: {
    position: 'absolute',
    width: '100%',
    height: 12,
    backgroundColor: '#FFFDF3',
  },

  roadVertical: {
    position: 'absolute',
    width: 10,
    height: '100%',
    backgroundColor: '#FFFDF3',
  },

  pin: {
    position: 'absolute',
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  pinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  mapCaption: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 7,
    color: '#526D7D',
    fontSize: 10,
  },

  detailBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    marginVertical: 14,
    alignItems: 'center',
  },

  bigNumber: {
    color: GREEN,
    fontWeight: 'bold',
    fontSize: 48,
    marginVertical: 8,
  },

  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  outlineButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BLUE,
  },

  outlineText: {
    color: BLUE,
  },

  label: {
    color: '#263D4D',
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 11,
    height: 47,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#DCE6ED',
    marginTop: 10,
    color: '#263D4D',
  },

  option: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E9EF',
    borderRadius: 11,
    padding: 13,
    marginTop: 7,
  },

  message: {
    color: RED,
    marginTop: 12,
    fontSize: 12,
  },

  link: {
    color: BLUE,
    fontSize: 12,
    fontWeight: 'bold',
  },

  forgot: {
    alignItems: 'flex-end',
    marginTop: 12,
  },

  centerText: {
    textAlign: 'center',
    color: '#718497',
    marginTop: 18,
    fontSize: 12,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  bottomBar: {
    minHeight: 63,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E3EBF0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
  },

  tabIcon: {
    fontSize: 20,
    color: '#8194A1',
  },

  tabLabel: {
    fontSize: 9,
    color: '#8194A1',
    marginTop: 3,
  },
});
