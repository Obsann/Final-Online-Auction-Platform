// // Import React hooks for state management
// import { useState } from 'react';
// // Import useNavigate for programmatic navigation
// import { useNavigate } from 'react-router-dom';
// // Import UI components from shadcn/ui library
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
// import Button from '../../components/ui/button';
// import { Input } from '../../components/ui/input';
// import { Label } from '../../components/ui/label';
// // Import icons from lucide-react
// import { CheckCircle2, ArrowRight } from 'lucide-react';
// // Import renamed CSS
// import './FaydaLanding.css';

// export default function FaydaLanding() {
//   const [faydaNumber, setFaydaNumber] = useState('');
//   const [isChecking, setIsChecking] = useState(false);
//   const [isEligible, setIsEligible] = useState(null);
//   const navigate = useNavigate();

//   const formatFAN = (value) => {
//     const digits = value.replace(/\D/g, '');
//     const limited = digits.slice(0, 16);
//     return limited.match(/.{1,4}/g)?.join('-') || limited;
//   };

//   const handleFANChange = (e) => {
//     const rawValue = e.target.value;
//     setFaydaNumber(formatFAN(rawValue));
//   };

//   const validateFAN = (fan) => fan.replace(/\D/g, '').length === 16;

//   const handleCheckEligibility = async () => {
//     if (!faydaNumber.trim()) {
//       alert('Please enter your Fayda Alias Number');
//       return;
//     }

//     if (!validateFAN(faydaNumber)) {
//       const digitCount = faydaNumber.replace(/\D/g, '').length;
//       if (digitCount < 16) {
//         alert(`FAN number is too short. You entered ${digitCount} digits, but 16 are required.`);
//       } else {
//         alert(`FAN number is too long. You entered ${digitCount} digits, but only 16 are required.`);
//       }
//       return;
//     }

//     setIsChecking(true);
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       sessionStorage.setItem('fayda_alias_number', faydaNumber);
//       setIsEligible(true);
//     } catch (error) {
//       console.error('FAN verification error:', error);
//       alert('Failed to verify FAN number. Please try again.');
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   return (
//     <div className="fayda-landing-container">
//       <Card className="fayda-landing-card">
//         <CardHeader className="text-center space-y-3 pb-8">
//           <div className="fayda-landing-icon-container">
//             <CheckCircle2 className="w-12 h-12 text-primary" />
//           </div>
//           <CardTitle className="text-3xl">Welcome to Fayda Portal</CardTitle>
//           <CardDescription className="text-lg">
//             Check your Fayda Alias Number eligibility to get started
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {!isEligible ? (
//             <>
//               <div className="space-y-3">
//                 <Label htmlFor="fayda-check" className="text-lg">
//                   Enter Your Fayda Alias Number
//                 </Label>
//                 <Input
//                   id="fayda-check"
//                   type="text"
//                   placeholder="XXXX-XXXX-XXXX-XXXX"
//                   value={faydaNumber}
//                   onChange={handleFANChange}
//                   disabled={isChecking}
//                   className="fayda-landing-input"
//                   maxLength={19}
//                   onKeyDown={(e) => e.key === 'Enter' && handleCheckEligibility()}
//                 />
//               </div>

//               <Button
//                 onClick={handleCheckEligibility}
//                 disabled={isChecking}
//                 size="lg"
//                 className="fayda-landing-button"
//               >
//                 {isChecking ? (
//                   <>
//                     <div className="fayda-loading-spinner"></div>
//                     Checking Eligibility...
//                   </>
//                 ) : (
//                   'Check Eligibility'
//                 )}
//               </Button>

//               <div className="bg-muted/50 rounded-lg p-6 mt-6">
//                 <h4 className="font-semibold mb-3">What is Fayda Alias Number?</h4>
//                 <p className="text-sm text-muted-foreground leading-relaxed">
//                   Your Fayda Alias Number is a unique identifier provided to eligible beneficiaries. 
//                   This number is required to access government services and benefits through our platform.
//                 </p>
//               </div>
//             </>
//           ) : (
//             <div className="space-y-8 animate-in fade-in duration-500">
//               <div className="fayda-eligibility-success">
//                 <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
//                   Eligibility Confirmed!
//                 </h3>
//                 <p className="text-green-700 dark:text-green-300">
//                   Your Fayda Alias Number is valid. Choose an option below to continue.
//                 </p>
//               </div>

//               <div className="fayda-option-cards">
//                 <Card className="fayda-option-card" onClick={() => navigate('/login')}>
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-between">
//                       Existing User
//                       <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                     </CardTitle>
//                     <CardDescription>Already have an account? Sign in here</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button className="w-full" variant="outline" size="lg">
//                       Login
//                     </Button>
//                   </CardContent>
//                 </Card>

//                 <Card className="fayda-option-card" onClick={() => navigate('/register')}>
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-between">
//                       New User
//                       <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                     </CardTitle>
//                     <CardDescription>First time here? Create an account</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <Button className="w-full" size="lg">
//                       Register
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </div>

//               <Button
//                 variant="ghost"
//                 onClick={() => {
//                   setIsEligible(null);
//                   setFaydaNumber('');
//                   sessionStorage.removeItem('fayda_alias_number');
//                 }}
//                 className="w-full"
//               >
//                 Check Different Number
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import './FaydaLanding.css';

export default function FaydaLanding() {
  const [faydaNumber, setFaydaNumber] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isEligible, setIsEligible] = useState(null);
  const navigate = useNavigate();

  // Format FAN number with dashes
  const formatFAN = (value) => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.slice(0, 16);
    return limited.match(/.{1,4}/g)?.join('-') || limited;
  };

  const handleFANChange = (e) => setFaydaNumber(formatFAN(e.target.value));

  const validateFAN = (fan) => fan.replace(/\D/g, '').length === 16;

  const handleCheckEligibility = async () => {
    if (!faydaNumber.trim()) {
      alert('Please enter your Fayda Alias Number');
      return;
    }

    if (!validateFAN(faydaNumber)) {
      const digitCount = faydaNumber.replace(/\D/g, '').length;
      alert(
        digitCount < 16
          ? `FAN number is too short. You entered ${digitCount} digits, but 16 are required.`
          : `FAN number is too long. You entered ${digitCount} digits, but only 16 are required.`
      );
      return;
    }

    setIsChecking(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock API
      sessionStorage.setItem('fayda_alias_number', faydaNumber);
      setIsEligible(true);
    } catch (err) {
      console.error('FAN verification error:', err);
      alert('Failed to verify FAN number. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const resetCheck = () => {
    setIsEligible(null);
    setFaydaNumber('');
    sessionStorage.removeItem('fayda_alias_number');
  };

  return (
    <div className="fayda-landing-container">
      <Card className="fayda-landing-card">
        <CardHeader className="text-center space-y-3 pb-8">
          <div className="fayda-landing-icon-container">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl">Welcome to Fayda Portal</CardTitle>
          <CardDescription className="text-lg">
            Check your Fayda Alias Number eligibility to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isEligible ? (
            <>
              <div className="space-y-3">
                <Label htmlFor="fayda-check" className="text-lg">
                  Enter Your Fayda Alias Number
                </Label>
                <Input
                  id="fayda-check"
                  type="text"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={faydaNumber}
                  onChange={handleFANChange}
                  disabled={isChecking}
                  className="fayda-landing-input"
                  maxLength={19}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckEligibility()}
                />
              </div>

              <Button
                onClick={handleCheckEligibility}
                disabled={isChecking}
                size="lg"
                className="fayda-landing-button"
              >
                {isChecking ? (
                  <>
                    <div className="fayda-loading-spinner"></div>
                    Checking Eligibility...
                  </>
                ) : (
                  'Check Eligibility'
                )}
              </Button>

              <div className="fayda-info-section">
                <h4>What is Fayda Alias Number?</h4>
                <p>
                  Your Fayda Alias Number is a unique identifier provided to eligible beneficiaries.
                  This number is required to access government services and benefits through our platform.
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="fayda-eligibility-success">
                <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                  Eligibility Confirmed!
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Your Fayda Alias Number is valid. Choose an option below to continue.
                </p>
              </div>

              <div className="fayda-option-cards">
                <Card className="fayda-option-card" onClick={() => navigate('/login')}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Existing User
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </CardTitle>
                    <CardDescription>Already have an account? Sign in here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline" size="lg">
                      Login
                    </Button>
                  </CardContent>
                </Card>

                <Card className="fayda-option-card" onClick={() => navigate('/register')}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      New User
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </CardTitle>
                    <CardDescription>First time here? Create an account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" size="lg">
                      Register
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Button variant="ghost" className="w-full" onClick={resetCheck}>
                Check Different Number
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
