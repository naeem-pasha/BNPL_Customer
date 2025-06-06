import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ViewDetailProps } from "@/Pages/home";
import axios from "axios";
import { useEffect, useState } from "react";

const DeliveryAuthorizationDialog: React.FC<ViewDetailProps> = ({ data }) => {
  const [distributerDetail, setDistributerDetail] = useState<any>(null);

  useEffect(() => {
    const fetchDistributerDetail = async () => {
      if (!data?.distributerNo) return;

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_USER_SERVER
          }/api/user/get-distributer-detail/${data.distributerNo}`
        );
        console.log(response);
        if (response.status === 200) {
          setDistributerDetail(response.data);
        }
      } catch (error) {
        console.error("Error fetching distributer detail:", error);
      }
    };

    fetchDistributerDetail();
  }, [data?.distributerNo]);

  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full mt-2"
          disabled={!data?.isSendAutherizedToUser}
        >
          Delivery Letter
        </Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="max-w-4xl bg-white rounded-lg shadow-lg p-6 font-sans overflow-y-auto max-h-[90vh]">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-4">
            Delivery Authorization Notice
          </h1>
          <p className="text-right font-semibold text-gray-600">
            {data?.updatedAt.split("T")[0]}
          </p>
        </div>

        {/* To Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">To,</h2>
          <div className="grid md:grid-cols-2 gap-4 border-b-2 pb-4">
            <div>
              <p className="font-semibold">Honda Atlas</p>
              <p className="text-gray-600">Karachi</p>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-semibold w-20">Attention:</span>
                <span>Mr. {data?.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-20">From:</span>
                <span>Meezan Bank Ltd.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 border-b-2 border-dashed pb-2">
            Authorization to take delivery of Bike.
          </h3>
          <p className="text-gray-600 mb-4">
            {/* With reference to the Sale offer, Number 
            dated
            <span className="font-semibold">
              {" "}
              {data?.updatedAt.split("T")[0]}
            </span>
            , we hereby confirm its receipt and hereby allow you to take
            delivery of your bike, have following details: */}
            With reference to the Musawamah contract, signed between MBL and
            you, # {data?._id.split("-")[0]},. We hereby allow you to take
            possession of the Bike which has the following details:
          </p>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left border">Goods</th>
                <th className="p-3 text-left border">Quantity</th>
                <th className="p-3 text-left border">Engine No.</th>
                <th className="p-3 text-left border">Chassis No.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border">
                  {data?.bikeVarient}, {data?.bikeColor}
                </td>
                <td className="p-3 border">01 Unit</td>
                <td className="p-3 border">{data?.engineNo}</td>
                <td className="p-3 border">{data?.chasisNo}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Buyer Information */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-semibold w-32">Buyer Name:</span>
              <span>Mr. {data?.name}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32">Contact #:</span>
              <span>{data?.phoneNo}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-semibold w-32">Buyer CNIC Number:</span>
              <span>{data?.cnic}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32">Delivery Time Period:</span>
              <span>(9AM to 6 PM) {data?.deliveryDate}</span>
            </div>
          </div>
        </div>

        {/* Distributer Information */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-semibold w-32">Distributer Name:</span>
              <span>Mr. {distributerDetail?.data?.data?.name}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32">Distributer Contact #:</span>
              <span> {distributerDetail?.data?.data?.phoneNo}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-semibold w-32">Distributer Address:</span>
              <span>{distributerDetail?.data?.data?.address}</span>
            </div>
          </div>
        </div>
        {/* Footer Section */}
        <div className="mt-8 border-t-2 pt-4">
          <div className="text-right">
            <p className="text-lg font-bold text-gray-700">
              Meezan Bank Limited
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryAuthorizationDialog;
