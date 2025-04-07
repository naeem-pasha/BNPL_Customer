import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ViewDetailProps } from "@/Pages/home";

const DeliveryAuthorizationDialog: React.FC<ViewDetailProps> = ({ data }) => {
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
                <span>Megzap Bank Ltd.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 border-b-2 border-dashed pb-2">
            Re: Authorization to Deliver the Goods
          </h3>
          <p className="text-gray-600 mb-4">
            With reference to the Sales Receipt Number MBL/2020/xxx, dated
            <span className="font-semibold"> 06th October 2020</span>, we hereby
            confirm its receipt and hereby authorize you as MBL's agent to take
            possession of the Goods and deliver it to our customer as per
            following details:
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
              <span className="font-semibold w-32">Buyer CXUC Number:</span>
              <span>{data?.cnic}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32">Delivery Time Period:</span>
              <span>(9AM to 6 PM)</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-8 border-t-2 pt-4">
          <div className="text-right">
            <p className="font-semibold">For and on behalf of</p>
            <p className="text-lg font-bold text-gray-700">
              Megzap Bank Limited
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryAuthorizationDialog;
