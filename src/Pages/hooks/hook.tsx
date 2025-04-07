import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const apiURL = import.meta.env.VITE_USER_SERVER;

export interface UserData {
  EmployID: string;
  bikeColor: string;
  bikeVarient: string;
  chasisNo: number;
  cnic: string;
  createdAt: string;
  distributerNo: number;
  email: string;
  engineNo: number;
  isAprovedByBank: boolean;
  isAprovedByVendor: boolean;
  isRejectedByBank: boolean;
  ownerShipTransfer: boolean;
  isAcceptMusawamah: boolean;
  finalAcceptence: boolean;
  isPublishedDeliveryLetter: boolean;
  isSendAutherizedToUser: boolean;
  isSendInvoiceToUser: boolean;
  confirmationRequest: boolean;
  name: string;
  phoneNo: string;
  status: string;
  updatedAt: string;
  price: number;
  installment_tenure: number;
  __v: number;
  _id: string;
}

const useHomeHook = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [status, setStatus] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // const getStepStatus = (step: string) => {
  //   switch (step) {
  //     case "completed":
  //       return "bg-primary";
  //     case "active":
  //       return "bg-blue-500";
  //     case "pending":
  //       return "bg-yellow-500";
  //     default:
  //       return "bg-muted";
  //   }
  // };

  const getDetailOfTheUser = async () => {
    try {
      const { data } = await axios.get(`${apiURL}/api/user/userDetail`, {
        withCredentials: true,
      });
      if (data.success) {
        setData(data.data);
        calculateStatus(data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStatus = (d: UserData) => {
    let result = 0;

    if (d.isAprovedByBank) {
      result = 33;
    }
    if (d.isAprovedByBank && d.isAprovedByVendor) {
      result = 100;
    }

    setStatus(result);
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${apiURL}/api/user/logout`, {
        withCredentials: true,
      });
      if (data.success) {
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to logout");
      }
    }
  };

  useEffect(() => {
    getDetailOfTheUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { handleLogout, data, status, loading, error };
};

export default useHomeHook;
