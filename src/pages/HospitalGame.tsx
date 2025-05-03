
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

interface Patient {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'baby';
  type: 'normal' | 'albino';
  symptoms: string[];
  treated: boolean;
  specialCase?: {
    type: 'sleepy' | 'stuck' | 'trash';
    description: string;
  };
}

interface Medicine {
  id: number;
  name: string;
  treats: string[];
  addons?: string[];
}

interface Tool {
  id: number;
  name: string;
  description: string;
  solves: ('sleepy' | 'stuck' | 'trash')[];
}

const HospitalGame: React.FC = () => {
  const [roomIndex, setRoomIndex] = useState<number>(0);
  const [patientsRooms, setPatientsRooms] = useState<Patient[][]>([
    // Первый кабинет
    [
      { 
        id: 1, 
        name: "Пончик", 
        gender: "male", 
        type: "normal", 
        symptoms: ["высокая температура", "головная боль"], 
        treated: false 
      },
      { 
        id: 2, 
        name: "Милка", 
        gender: "female", 
        type: "normal", 
        symptoms: ["боль в животе", "потеря аппетита"], 
        treated: false 
      },
      { 
        id: 3, 
        name: "Малыш", 
        gender: "baby", 
        type: "normal", 
        symptoms: ["кашель", "насморк"], 
        treated: false 
      },
      { 
        id: 4, 
        name: "Снежок", 
        gender: "male", 
        type: "albino", 
        symptoms: ["сонливость", "слабость"], 
        treated: false 
      }
    ],
    // Второй кабинет (с сонными пациентами и особыми случаями)
    [
      { 
        id: 5, 
        name: "Соня", 
        gender: "female", 
        type: "normal", 
        symptoms: ["головная боль"], 
        treated: false,
        specialCase: {
          type: 'sleepy',
          description: 'Не выспалась, постоянно зевает'
        }
      },
      { 
        id: 6, 
        name: "Бублик", 
        gender: "male", 
        type: "normal", 
        symptoms: ["боль в горле"], 
        treated: false,
        specialCase: {
          type: 'stuck',
          description: 'Застряла лампочка во рту'
        }
      },
      { 
        id: 7, 
        name: "Пушинка", 
        gender: "female", 
        type: "albino", 
        symptoms: ["головокружение"], 
        treated: false,
        specialCase: {
          type: 'trash',
          description: 'На голове застрял мусорный бак'
        }
      },
      { 
        id: 8, 
        name: "Сплюшка", 
        gender: "baby", 
        type: "normal", 
        symptoms: [], 
        treated: false,
        specialCase: {
          type: 'sleepy',
          description: 'Не может проснуться'
        }
      }
    ]
  ]);

  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: "Капибацилин", treats: ["высокая температура", "головная боль"], addons: ["водяной цветок"] },
    { id: 2, name: "Животворин", treats: ["боль в животе", "потеря аппетита"], addons: ["ледяная каламанси"] },
    { id: 3, name: "Кашлетрон", treats: ["кашель", "насморк"], addons: ["мятная трава"] },
    { id: 4, name: "Энерджайзер", treats: ["сонливость", "слабость"], addons: ["солнечный корень"] }
  ]);

  const tools: Tool[] = [
    { 
      id: 1, 
      name: "Маленькая клешня", 
      description: "Неметаллическая клешня для извлечения предметов",
      solves: ['stuck']
    },
    { 
      id: 2, 
      name: "Бодрящий колокольчик", 
      description: "Будит даже самых сонных капибар",
      solves: ['sleepy']
    },
    { 
      id: 3, 
      name: "Подъёмник для мусора", 
      description: "Помогает снять мусорные баки с головы",
      solves: ['trash']
    }
  ];

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [doctorComment, setDoctorComment] = useState<string>("");

  const getCurrentPatients = () => patientsRooms[roomIndex];

  const updatePatient = (patientId: number, updatedFields: Partial<Patient>) => {
    setPatientsRooms(prevRooms => 
      prevRooms.map((room, idx) => 
        idx === roomIndex 
          ? room.map(patient => 
              patient.id === patientId 
                ? { ...patient, ...updatedFields } 
                : patient
            )
          : room
      )
    );
  };

  const treatPatient = () => {
    if (!selectedPatient) return;

    // Если есть специальный случай, нужен инструмент
    if (selectedPatient.specialCase && !selectedTool) {
      setDoctorComment("Доктор Йод: Каламанси, этому пациенту нужен специальный инструмент!");
      return;
    }

    // Обработка специального случая
    if (selectedPatient.specialCase && selectedTool) {
      if (selectedTool.solves.includes(selectedPatient.specialCase.type)) {
        updatePatient(selectedPatient.id, { treated: true, specialCase: undefined });
        
        let specialMessage = "";
        if (selectedPatient.specialCase.type === 'sleepy') {
          specialMessage = `Доктор Йод: Отлично! ${selectedPatient.name} проснулся благодаря бодрящему колокольчику!`;
        } else if (selectedPatient.specialCase.type === 'stuck') {
          specialMessage = `Доктор Йод: Молодец, Каламанси! Лампочка успешно извлечена изо рта ${selectedPatient.name}!`;
        } else if (selectedPatient.specialCase.type === 'trash') {
          specialMessage = `Доктор Йод: Превосходно! Мусорный бак снят с головы ${selectedPatient.name}!`;
        }
        
        setDoctorComment(specialMessage);
        
        // Сбрасываем выбор после лечения
        setTimeout(() => {
          setSelectedPatient(null);
          setSelectedTool(null);
        }, 2000);
        
        return;
      } else {
        setDoctorComment(`Доктор Йод: Хм, ${selectedTool.name} не поможет в этом случае...`);
        return;
      }
    }

    // Обычное лечение
    if (selectedMedicine) {
      const isCorrectMedicine = selectedPatient.symptoms.some(symptom => 
        selectedMedicine.treats.includes(symptom)
      );

      let message = "";
      if (isCorrectMedicine) {
        updatePatient(selectedPatient.id, { treated: true });
        message = `Доктор Йод: Отличная работа, Каламанси! ${selectedPatient.name} идёт на поправку.`;
      } else {
        message = `Доктор Йод: Хмм, Каламанси, я думаю это не совсем подходящее лекарство для ${selectedPatient.name}. Попробуем другое?`;
      }

      if (selectedAddon) {
        message += ` Добавка "${selectedAddon}" была очень кстати!`;
      }

      setDoctorComment(message);
      
      // Сбрасываем выбор после лечения
      setTimeout(() => {
        setSelectedPatient(null);
        setSelectedMedicine(null);
        setSelectedAddon(null);
      }, 2000);
    }
  };

  const nextRoom = () => {
    setRoomIndex((prevIndex) => (prevIndex + 1) % patientsRooms.length);
    setSelectedPatient(null);
    setSelectedMedicine(null);
    setSelectedAddon(null);
    setSelectedTool(null);
    setDoctorComment("");
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Больница Капибар</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Кабинет {roomIndex + 1}</span>
          <Button onClick={nextRoom}>
            <Icon name="ArrowRight" size={16} className="mr-2" />
            Следующий кабинет
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <Card className="w-1/2 p-4 bg-purple-50">
          <h2 className="text-xl font-semibold mb-2">Персонал</h2>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-purple-200 flex items-center justify-center mb-2">
                <span className="text-4xl">👩‍⚕️</span>
              </div>
              <p className="font-medium">Каламанси</p>
              <p className="text-sm text-gray-600">Медсестра</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <span className="text-4xl">👨‍⚕️</span>
              </div>
              <p className="font-medium">Йод</p>
              <p className="text-sm text-gray-600">Доктор (альбинос)</p>
            </div>
          </div>
        </Card>

        <Card className="w-1/2 p-4 bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">Реакция доктора</h2>
          <div className="min-h-24 flex items-center justify-center">
            {doctorComment ? (
              <p className="text-gray-800">{doctorComment}</p>
            ) : (
              <p className="text-gray-500 italic">Ожидаем ваших действий...</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Пациенты</h2>
          <div className="grid grid-cols-2 gap-4">
            {getCurrentPatients().map(patient => (
              <div 
                key={patient.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedPatient?.id === patient.id ? 'ring-2 ring-purple-400 bg-purple-50' : 
                  patient.treated ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => !patient.treated && setSelectedPatient(patient)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    patient.type === 'albino' ? 'bg-gray-100' : 'bg-amber-200'
                  }`}>
                    {patient.gender === 'male' && <span className="text-xl">🦫</span>}
                    {patient.gender === 'female' && <span className="text-xl">🦫</span>}
                    {patient.gender === 'baby' && <span className="text-xl">🦫</span>}
                  </div>
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-gray-600">
                      {patient.gender === 'male' && 'Самец'} 
                      {patient.gender === 'female' && 'Самка'} 
                      {patient.gender === 'baby' && 'Детёныш'}
                      {patient.type === 'albino' ? ' (Альбинос)' : ''}
                    </p>
                  </div>
                </div>

                {patient.specialCase && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-amber-600">
                      {patient.specialCase.type === 'sleepy' && <Icon name="Moon" size={14} className="inline mr-1" />}
                      {patient.specialCase.type === 'stuck' && <Icon name="AlertTriangle" size={14} className="inline mr-1" />}
                      {patient.specialCase.type === 'trash' && <Icon name="Trash2" size={14} className="inline mr-1" />}
                      {patient.specialCase.description}
                    </p>
                  </div>
                )}

                {patient.symptoms.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Симптомы:</p>
                    <ul className="text-xs text-gray-600">
                      {patient.symptoms.map((symptom, idx) => (
                        <li key={idx}>• {symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {patient.treated && (
                  <div className="mt-2 text-green-600 text-sm font-medium">
                    <Icon name="CheckCircle" size={16} className="inline mr-1" />
                    Вылечен
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Лечение</h2>
          {selectedPatient ? (
            <Tabs defaultValue={selectedPatient.specialCase ? "tools" : "medicines"}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="medicines" className="flex-1">Лекарства</TabsTrigger>
                <TabsTrigger value="addons" className="flex-1">Добавки</TabsTrigger>
                <TabsTrigger value="tools" className="flex-1">Инструменты</TabsTrigger>
              </TabsList>
              
              <TabsContent value="medicines">
                <div className="grid grid-cols-2 gap-3">
                  {medicines.map(medicine => (
                    <div 
                      key={medicine.id}
                      className={`p-3 border rounded-lg cursor-pointer ${
                        selectedMedicine?.id === medicine.id ? 'ring-2 ring-blue-400 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedMedicine(medicine);
                        setSelectedTool(null);
                      }}
                    >
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-xs text-gray-600 mt-1">Лечит: {medicine.treats.join(', ')}</p>
                    </div>
                  ))}
                  {selectedPatient.specialCase && (
                    <div className="col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-700">
                        <Icon name="AlertCircle" size={16} className="inline mr-1" />
                        У пациента особый случай. Возможно, потребуется специальный инструмент.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="addons">
                <div className="grid grid-cols-2 gap-3">
                  {selectedMedicine?.addons?.map((addon, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 border rounded-lg cursor-pointer ${
                        selectedAddon === addon ? 'ring-2 ring-green-400 bg-green-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedAddon(addon)}
                    >
                      <p className="font-medium">{addon}</p>
                      <p className="text-xs text-gray-600 mt-1">Усиливает действие лекарства</p>
                    </div>
                  ))}
                  {(!selectedMedicine || !selectedMedicine.addons?.length) && (
                    <p className="text-gray-500 italic col-span-2 p-3">
                      Сначала выберите лекарство, чтобы увидеть доступные добавки
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tools">
                <div className="grid grid-cols-2 gap-3">
                  {tools.map(tool => (
                    <div 
                      key={tool.id}
                      className={`p-3 border rounded-lg cursor-pointer ${
                        selectedTool?.id === tool.id ? 'ring-2 ring-blue-400 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedTool(tool);
                        setSelectedMedicine(null);
                        setSelectedAddon(null);
                      }}
                    >
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{tool.description}</p>
                    </div>
                  ))}
                  {!selectedPatient.specialCase && (
                    <p className="text-gray-500 italic col-span-2 p-3">
                      У этого пациента нет особых случаев, требующих инструментов
                    </p>
                  )}
                </div>
              </TabsContent>

              <div className="mt-6">
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={(!selectedMedicine && !selectedTool) || selectedPatient.treated}
                  onClick={treatPatient}
                >
                  {selectedTool ? "Использовать инструмент" : "Применить лечение"}
                </Button>
              </div>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              Выберите пациента для лечения
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HospitalGame;
