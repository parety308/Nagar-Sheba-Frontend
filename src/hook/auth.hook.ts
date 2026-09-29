import { useMutation, useQuery } from "@tanstack/react-query";


export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: userSignUp,
  });
}

export function useLogOut() {
  return useMutation({
    mutationFn: userLogOut,
  });
}

export function useProfile() {
  return useQuery({
    queryKey:["user"],
    queryFn:userProfile,
    retry:false
  })
  
}