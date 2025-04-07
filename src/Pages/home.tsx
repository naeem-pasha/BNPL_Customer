import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../components/ui/card";
import { Badge } from "./../components/ui/badge";
import { Check, Clock, Package, User2 } from "lucide-react";
import { Progress } from "./../components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "./../components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useHomeHook, { UserData } from "./hooks/hook";
import axios from "axios";
import DeliveryAuthorizationDialog from "@/components/ui/custom/DeliveryAuthorization";
import Invoice from "@/components/ui/custom/Invoice";
import { DialogClose } from "@radix-ui/react-dialog";

const Home = () => {
  const { handleLogout, data, status, error, loading } = useHomeHook();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Hi {data?.name}
            </h1>
            <p className="text-muted-foreground">
              Track your Application Status
            </p>
          </div>
          <Button onClick={handleLogout} className="bg-red-800">
            Logout
          </Button>
        </div>

        {/* Approval Progress */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Bank Approval</CardTitle>
              <CardDescription>First step of verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="bg-primary">
                  <Check className="w-4 h-4 mr-1" />
                  Approved
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {/* Completed on Jan 15, 2024 */}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Vendor Approval</CardTitle>
              <CardDescription>Second step of verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="bg-primary">
                  <Check className="w-4 h-4 mr-1" />
                  Approved
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {/* Completed on Jan 16, 2024 */}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Shopping Access</CardTitle>
              <CardDescription>Final step to start shopping</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="bg-blue-500">
                  <User2 className="w-4 h-4 mr-1" />
                  Active
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {/* Granted on Jan 17, 2024 */}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Order */}
        <Card>
          <CardHeader>
            <CardTitle>Your Status</CardTitle>
            <CardDescription>Track your Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Package className="w-8 h-8" />
                  <div>
                    <h4 className="font-semibold">
                      Employ Id #{data?.EmployID}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Placed on Jan 20, 2024
                    </p>
                  </div>
                </div>
                {data?.confirmationRequest && (
                  <ConfirmationRequest data={data} />
                )}
                {data?.isRejectedByBank ? (
                  <RejecteDetail />
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Clock className="w-4 h-4" />
                    Processing
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Application Progress</span>
                  <span>{status}%</span>
                </div>
                <Progress value={status} className="h-2" />
              </div>
              <div className="grid grid-cols-3 text-center text-sm">
                <div>
                  <div className="font-semibold">Approve By Bank</div>
                  <div className="text-muted-foreground">Current</div>
                </div>
                <div>
                  <div className="font-semibold">Approved By Vendor</div>
                  <div className="text-muted-foreground">Next</div>
                </div>
                <div>
                  <div className="font-semibold">Assign the Distributer</div>
                  <div className="text-muted-foreground">Final</div>
                </div>
              </div>
              <div>
                <div className="">
                  <ViewDetail data={data} />
                  {data?.isSendAutherizedToUser && (
                    <DeliveryAuthorizationDialog data={data} />
                  )}
                  {/* {data?.isSendInvoiceToUser && <Invoice data={data} />} */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
export interface ViewDetailProps {
  data?: UserData | null;
}

const ViewDetail: React.FC<ViewDetailProps> = ({ data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const disable = !data?.ownerShipTransfer;

  // const handleAccept = async (id: string) => {
  //   try {
  //     setIsSubmitting(true);
  //     setError(null);

  //     const result = await axios.put(
  //       `${import.meta.env.VITE_USER_SERVER}/api/user/finalAcceptence/${id}`
  //     );
  //     console.log(result);
  //     if (result.data.success) {
  //       setIsOpen(false); // Close dialog on success
  //       // Optional: Add toast notification here
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     if (axios.isAxiosError(err)) {
  //       setError(err.response?.data?.message || "Failed to accept the offer");
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleAccept = async (id: string) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const result = await axios.put(
        `${import.meta.env.VITE_USER_SERVER}/api/user/accept-musawamah/${id}`
      );
      if (result.data.success) {
        setIsOpen(false); // Close dialog on success
        // Optional: Add toast notification here
      }
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to accept the musawamah"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) {
    return <p className="text-gray-500">Loading sale details...</p>;
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            disabled={disable || isSubmitting}
            className="w-full relative"
          >
            {isSubmitting && (
              <span className="absolute left-2 top-2.5 animate-spin">↻</span>
            )}
            View Your Sale Offer
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-white w-[794px] h-[800px] overflow-y-auto mx-auto shadow-lg p-1">
          {isSubmitting ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin text-2xl">↻</div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg font-mono">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                  {error}
                </div>
              )}

              <div className="max-w-3xl mx-auto bg-white p-6 font-serif text-black">
                <div className="text-center mb-4">
                  <p className="text-xs mb-2">
                    THIS Appendix shall be attached to and form an integral part
                    of the package of Master Musawamah Agreement (the
                    "Agreement") made at{" "}
                    <span className="underline font-bold">Karachi</span> on{" "}
                    <span className="underline font-bold">
                      ___{data?.createdAt?.split("-")[0]}___
                    </span>{" "}
                    BETWEEN
                  </p>
                  <h1 className="text-xl font-bold tracking-wider mb-1">
                    {data.name}
                  </h1>
                  <p className="text-sm font-bold">And</p>
                  <h2 className="text-lg font-bold mb-1">
                    MEEZAN BANK LIMITED
                  </h2>
                  <h3 className="text-base font-bold underline">
                    MUSAWAMAH CONTRACT
                  </h3>
                </div>
                <div className="mb-4 text-sm">
                  <p>
                    OED We offer to purchase the following Asset(s) from you for{" "}
                    <span className="font-bold">Rs. {data.price}/-</span>{" "}
                    (Rupees SEVENTY EIGHT THOUSAND NINE HUNDRED AND FORTY EIGHT
                    Only) which shall be payable by us as per the terms of the
                    Master Musawamah Agreement between us{" "}
                    <span className="underline">
                      ___{data?.createdAt?.split("-")[0]}___
                    </span>
                  </p>
                </div>
                <div className="mb-4">
                  <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                      <tr>
                        <th
                          colSpan={2}
                          className="border border-black p-1 text-center"
                        >
                          Description of Asset
                        </th>
                        <th className="border border-black p-1 text-center">
                          Bike
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-1 pl-2">
                          Serial / Part /Engine No
                        </td>
                        <td className="border border-black p-1"></td>
                        <td className="border border-black p-1 text-center">
                          {data.engineNo}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1 pl-2">Model</td>
                        <td className="border border-black p-1"></td>
                        <td className="border border-black p-1 text-center">
                          {data.bikeVarient}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mb-4">
                  <h3 className="text-center font-bold underline mb-2">
                    PAYMENT SCHEDULE
                  </h3>
                  <p className="text-sm mb-2">
                    Installment amount due in arrears on{" "}
                    <span className="underline">26</span>th of each month. The
                    date of the first monthly installment payment shall start on{" "}
                    <span className="underline font-bold">26-01-2024</span>
                  </p>
                  <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                      <tr>
                        <th
                          rowSpan={2}
                          className="border border-black p-1 text-center"
                        >
                          Particulars
                        </th>
                        <th className="border border-black p-1 text-center">
                          Monthly Installment (Rs.)
                        </th>
                      </tr>
                      <tr>
                        <th className="border border-black p-1 text-center">
                          SST: Incl.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-1 pl-2">
                          {data?.installment_tenure} Months
                        </td>
                        <td className="border border-black p-1 text-center">
                          {data?.price}/-
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1 pl-2 font-bold">
                          Total
                        </td>
                        <td className="border border-black p-1 text-center font-bold">
                          {data?.price}/-
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mb-4 text-sm">
                  <p>
                    Customer Name:{" "}
                    <span className="font-bold">OWAIS AHMED SIDDIQUI</span>
                  </p>
                  <div className="flex mt-4">
                    <p>
                      Date:{" "}
                      <span className="underline">
                        ___{data?.createdAt?.split("-")[0]}___
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-xs mb-4">
                  <p className="font-bold">Meezan Bank Limited</p>
                  <p>C-25, Meezan House,</p>
                  <p>Estate Avenue, S.I.T.E.,</p>
                  <p>Karachi</p>
                </div>
                <div className="text-xs mb-6">
                  <p>
                    I/We accept your purchase offer &amp; sell the Asset to you
                    for a Contract Price of{" "}
                    <span className="font-bold">Rs. {data.price} -</span>{" "}
                    (Rupees SEVENTY EIGHT THOUSAND NINE HUNDRED AND FORTY EIGHT
                    Only) which shall be payable as per the terms of the Master
                    Musawamah Agreement between us{" "}
                    <span className="underline">
                      ___{data?.createdAt?.split("-")[0]}___
                    </span>{" "}
                    in accordance with the Payment Schedule appearing above
                  </p>
                </div>
                <div className="text-xs">
                  <p>For and on behalf of</p>
                  <p>Meezan Bank Limited</p>
                  <p className="mt-4">WITNESSES:</p>
                  <div className="flex justify-between mt-4">
                    <div className="w-1/2 border-t border-black pt-1">
                      <p>Name: _______________</p>
                      <p>CNIC No: ____________</p>
                      <p>Address: ____________</p>
                    </div>
                    <div className="w-1/2 border-t border-black pt-1">
                      <p>Name: _______________</p>
                      <p>CNIC No: ____________</p>
                      <p>Address: ____________</p>
                    </div>
                  </div>
                </div>
              </div>

              {!data.isPublishedDeliveryLetter && (
                <Button
                  onClick={() => handleAccept(data._id)}
                  disabled={isSubmitting || data.isAcceptMusawamah}
                  className="relative"
                >
                  {isSubmitting && (
                    <span className="absolute left-2 top-2 animate-spin">
                      ↻
                    </span>
                  )}
                  Accept
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const RejecteDetail = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="w-full bg-red-700 hover:bg-red-500"
          >
            {" "}
            Rejected
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg border-2 border-red-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-red-700 mb-2">
                Application Rejected
              </h1>
              <div className="w-16 h-1 bg-red-300 mx-auto mb-4"></div>
            </div>

            <p className="text-gray-700 mb-5">
              We regret to inform you that your application has been reviewed
              and could not be approved at this time.
            </p>

            <div className="bg-red-50 p-4 border-l-4 border-red-500 mb-5">
              <p className="text-sm text-red-800">
                Our decision was based on the criteria outlined in our lending
                policy. This does not reflect on your character or reliability.
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <h2 className="text-lg font-medium text-gray-800">
                What happens next?
              </h2>
              <p className="text-gray-600 text-sm">
                You can request more information about this decision or explore
                alternative options with our customer service team.
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition duration-200">
                Contact Customer Service
              </button>
              <button className="w-full py-2 px-4 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded border border-gray-300 transition duration-200">
                Explore Other Options
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ConfirmationRequestProps {
  data: {
    _id: string;
    // other properties of the data object
  };
}

const ConfirmationRequest: React.FC<ConfirmationRequestProps> = ({ data }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleAcceptDelivery = async (id: string) => {
    try {
      // Make the API request to accept delivery
      const result = await axios.put(
        `${import.meta.env.VITE_USER_SERVER}/api/user/accept-delivery/${id}`
      );
      // If the request is successful, close the dialog
      if (result.status === 200) {
        setIsDialogOpen(false); // Close the dialog on success
        alert("Delivery accepted successfully!"); // Optional: show a success message
      } else {
        alert("Something went wrong. Please try again."); // Optional: show a failure message
      }
    } catch (error) {
      console.error("Error accepting delivery:", error);
      alert("Failed to accept delivery. Please try again later.");
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="w-full bg-green-600 hover:bg-green-500"
          >
            Delivery Confirmation
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg border-2 border-blue-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-blue-700 mb-2">
                Delivery Confirmation
              </h1>
              <div className="w-16 h-1 bg-blue-300 mx-auto mb-4"></div>
            </div>

            <p className="text-gray-700 mb-5">
              Please review the delivery details and confirm you are ready to
              accept the package.
            </p>

            <div className="bg-blue-50 p-4 border-l-4 border-blue-500 mb-5">
              <p className="text-sm text-blue-800">
                Ensure all items are present and in good condition before
                confirmation.
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirm-delivery"
                  checked={isChecked}
                  onCheckedChange={handleCheckboxChange}
                />
                <label
                  htmlFor="confirm-delivery"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm that I am ready to accept the delivery
                </label>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => handleAcceptDelivery(data?._id)}
                disabled={!isChecked}
                className={`w-full py-2 px-4 ${
                  isChecked
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white font-medium rounded transition duration-200`}
              >
                Accept Delivery
              </Button>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full py-2 px-4 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded border border-gray-300 transition duration-200"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
