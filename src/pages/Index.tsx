
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">Больница Капибар</h1>
      
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-6">
          <div className="text-6xl">🦫</div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Добро пожаловать!</h2>
        
        <p className="mb-6 text-gray-700">
          Присоединяйтесь к команде медсестры Каламанси и доктора Йода, чтобы лечить капибар и помогать им выздоравливать!
        </p>
        
        <Button 
          size="lg" 
          className="w-full" 
          onClick={() => navigate('/hospital-game')}
        >
          Начать игру
        </Button>
      </div>
    </div>
  );
}
